import {
  BadRequestException,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Prisma } from '@prisma/client';
import { z } from 'zod';
import { IotService } from './iot.service';

const TelemetrySchema = z.object({
  event: z.string().regex(/^iot\.[a-z0-9_.-]{1,120}$/),
  data: z.record(z.string(), z.json()),
  timestamp: z.string().datetime().optional(),
}).strict();

interface TenantRequest {
  user?: { tenantId?: string };
}

@Controller('iot')
export class IotController {
  constructor(private readonly iot: IotService) {}

  @Post('webhooks/:deviceId')
  async receiveWebhook(
    @Param('deviceId') deviceId: string,
    @Headers('x-tenant-id') tenantId: string | undefined,
    @Headers('x-tradeops-timestamp') timestamp: string | undefined,
    @Headers('x-tradeops-signature') signature: string | undefined,
    @Body() body: unknown,
  ) {
    if (!tenantId || !timestamp || !signature) {
      throw new UnauthorizedException('Tenant and signed webhook headers are required.');
    }
    if (!this.iot.verifyWebhookSignature(tenantId, deviceId, timestamp, signature, body)) {
      throw new UnauthorizedException('Webhook signature is invalid or expired.');
    }

    const parsed = TelemetrySchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException({
        message: 'Invalid IoT telemetry payload.',
        issues: parsed.error.issues.map(({ path, message }) => ({ path, message })),
      });
    }
    const event = await this.iot.acceptTelemetry(
      tenantId,
      deviceId,
      { ...parsed.data, data: parsed.data.data as Prisma.InputJsonObject },
      signature,
    );
    return { accepted: true, eventId: event.id, receivedAt: event.at };
  }

  @Get('devices/:deviceId/telemetry')
  @UseGuards(AuthGuard('jwt'))
  getTelemetry(
    @Req() req: TenantRequest,
    @Param('deviceId') deviceId: string,
    @Query('limit') limitValue?: string,
  ) {
    const tenantId = req.user?.tenantId;
    if (!tenantId) throw new UnauthorizedException('Authenticated user has no tenant.');
    const limit = limitValue === undefined ? 100 : Number(limitValue);
    if (!Number.isInteger(limit) || limit < 1 || limit > 500) {
      throw new BadRequestException('limit must be an integer between 1 and 500.');
    }
    return this.iot.getTelemetry(tenantId, deviceId, limit);
  }
}
