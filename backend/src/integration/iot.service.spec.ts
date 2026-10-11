import { createHmac } from 'node:crypto';
import { expect, jest } from '@jest/globals';
import { PrismaService } from '../prisma/prisma.service';
import { IotService } from './iot.service';

describe('IotService', () => {
  const originalSecret = process.env.IOT_WEBHOOK_SECRET;

  afterEach(() => {
    if (originalSecret === undefined) delete process.env.IOT_WEBHOOK_SECRET;
    else process.env.IOT_WEBHOOK_SECRET = originalSecret;
  });

  it('accepts a recent signature bound to tenant, device, and body', () => {
    process.env.IOT_WEBHOOK_SECRET = 'webhook-secret';
    const tenantId = 'tenant-1';
    const deviceId = 'sensor/1';
    const timestamp = String(Math.floor(Date.now() / 1000));
    const body = { event: 'iot.telemetry.received', data: { temperature: 21 } };
    const canonical = `${timestamp}.${tenantId}.${deviceId}.${JSON.stringify(body)}`;
    const signature = createHmac('sha256', 'webhook-secret').update(canonical).digest('hex');
    const service = new IotService({} as PrismaService);

    expect(service.verifyWebhookSignature(tenantId, deviceId, timestamp, signature, body)).toBe(true);
    expect(service.verifyWebhookSignature('another-tenant', deviceId, timestamp, signature, body)).toBe(false);
    expect(service.verifyWebhookSignature(tenantId, deviceId, timestamp, signature, { ...body, data: {} })).toBe(false);
  });

  it('rejects stale webhook timestamps and missing secrets', () => {
    process.env.IOT_WEBHOOK_SECRET = 'webhook-secret';
    const service = new IotService({} as PrismaService);
    expect(service.verifyWebhookSignature('t', 'd', '1', 'a'.repeat(64), {})).toBe(false);
    delete process.env.IOT_WEBHOOK_SECRET;
    expect(service.verifyWebhookSignature('t', 'd', String(Date.now() / 1000), 'a'.repeat(64), {})).toBe(false);
  });

  it('stores telemetry in the signed tenant and rejects an already stored signature', async () => {
    const create = jest.fn().mockResolvedValue({
      id: 'evt-1',
      at: new Date('2026-01-01T00:00:00.000Z'),
      topic: 'iot.telemetry.received',
      payload: {},
    });
    const findFirst = jest.fn().mockResolvedValue(null);
    const prisma = { domainEvent: { create, findFirst } } as unknown as PrismaService;
    const service = new IotService(prisma);
    const input = { event: 'iot.telemetry.received', data: { temperature: 21 } };

    await service.acceptTelemetry('tenant-1', 'sensor-1', input, 'signature');
    expect(create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ tenantId: 'tenant-1', topic: input.event }),
    }));

    findFirst.mockResolvedValue({ id: 'evt-1' });
    await expect(service.acceptTelemetry('tenant-1', 'sensor-1', input, 'signature')).rejects.toThrow(
      'This webhook has already been accepted.',
    );
    expect(create).toHaveBeenCalledTimes(1);
  });
});
