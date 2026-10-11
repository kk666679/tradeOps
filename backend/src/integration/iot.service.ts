import { ConflictException, Injectable } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'node:crypto';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const REPLAY_WINDOW_MS = 5 * 60 * 1000;

@Injectable()
export class IotService {
  constructor(private readonly prisma: PrismaService) {}

  verifyWebhookSignature(
    tenantId: string,
    deviceId: string,
    timestamp: string,
    signature: string,
    body: unknown,
  ): boolean {
    const secret = process.env.IOT_WEBHOOK_SECRET?.trim();
    const timestampMs = Number(timestamp) * 1000;
    if (
      !secret ||
      !Number.isFinite(timestampMs) ||
      Math.abs(Date.now() - timestampMs) > REPLAY_WINDOW_MS ||
      !/^[a-f0-9]{64}$/i.test(signature)
    ) {
      return false;
    }

    const canonical = `${timestamp}.${tenantId}.${deviceId}.${JSON.stringify(body)}`;
    const expected = createHmac('sha256', secret).update(canonical).digest();
    const supplied = Buffer.from(signature, 'hex');
    return supplied.length === expected.length && timingSafeEqual(supplied, expected);
  }

  async acceptTelemetry(
    tenantId: string,
    deviceId: string,
    input: { event: string; data: Prisma.InputJsonObject; timestamp?: string },
    signature: string,
  ) {
    const duplicate = await this.prisma.domainEvent.findFirst({
      where: {
        tenantId,
        topic: input.event,
        payload: { path: ['signature'], equals: signature },
      },
      select: { id: true },
    });
    if (duplicate) throw new ConflictException('This webhook has already been accepted.');

    const created = await this.prisma.domainEvent.create({
      data: {
        tenantId,
        topic: input.event,
        payload: {
          deviceId,
          data: input.data,
          signature,
          ...(input.timestamp ? { timestamp: input.timestamp } : {}),
        },
      },
      select: { id: true, at: true, topic: true, payload: true },
    });
    return created;
  }

  async getTelemetry(tenantId: string, deviceId: string, limit: number) {
    const events = await this.prisma.domainEvent.findMany({
      where: {
        tenantId,
        topic: { startsWith: 'iot.' },
        payload: { path: ['deviceId'], equals: deviceId },
      },
      orderBy: { at: 'desc' },
      take: limit,
      select: { id: true, at: true, topic: true, payload: true },
    });
    return events.map((event) => {
      if (typeof event.payload !== 'object' || event.payload === null || Array.isArray(event.payload)) {
        return event;
      }
      const { signature: _signature, ...payload } = event.payload;
      return { ...event, payload };
    });
  }
}
