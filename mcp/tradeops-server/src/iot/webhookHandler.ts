/**
 * Webhook handler with HMAC validation, rate limiting, and retry logic.
 * Processes incoming telemetry, normalizes it, appends to ledger, and broadcasts via SSE.
 */

import { createHmac } from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';
import type { DeviceRegistry } from './deviceRegistry.js';
import type { TelemetryNormalizer } from './telemetryNormalizer.js';
import type { BondedLedger } from '../backend/ledger.js';
import type { SSEBroadcaster } from './sseBroadcaster.js';
import { RateLimiter } from '../middleware/rateLimit.js';
import { logger } from '../logger.js';

const log = logger.child({ component: 'webhookHandler' });

export interface WebhookPayload {
  deviceId: string;
  timestamp: string;
  signature: string;
  data: unknown;
}

interface RetryQueueItem {
  deviceId: string;
  payload: unknown;
  attempts: number;
}

export class WebhookHandler {
  private rateLimiter: RateLimiter;
  private retryQueue: RetryQueueItem[] = [];
  private secret: string;

  constructor(
    private readonly deviceRegistry: DeviceRegistry,
    private readonly normalizer: TelemetryNormalizer,
    private readonly ledger: BondedLedger,
    private readonly broadcaster: SSEBroadcaster,
    secret?: string,
  ) {
    this.secret = secret || process.env.WEBHOOK_SECRET || 'default-secret';
    this.rateLimiter = new RateLimiter({ requestsPerMinute: 1000 });
  }

  /**
   * Express middleware for webhook endpoint.
   */
  middleware() {
    return async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      try {
        const payload = req.body as WebhookPayload;

        // Validate required fields
        if (!payload.deviceId || !payload.timestamp || !payload.signature || !payload.data) {
          res.status(400).json({ error: 'Missing required fields: deviceId, timestamp, signature, data' });
          return;
        }

        // Check device exists
        const device = this.deviceRegistry.get(payload.deviceId);
        if (!device) {
          res.status(404).json({ error: `Device ${payload.deviceId} not found` });
          return;
        }

        // Rate limit check
        const rateCheck = this.rateLimiter.check(`device:${payload.deviceId}`);
        if (!rateCheck.allowed) {
          res.status(429).json({
            error: 'Rate limit exceeded',
            resetAt: rateCheck.resetAt,
          });
          return;
        }

        // Validate timestamp (within 60s)
        const now = Date.now();
        const timestamp = new Date(payload.timestamp).getTime();
        if (Math.abs(now - timestamp) > 60_000) {
          res.status(400).json({ error: 'Timestamp expired or too far in future' });
          return;
        }

        // Validate HMAC signature
        if (!this.validateSignature(payload)) {
          res.status(401).json({ error: 'Invalid signature' });
          return;
        }

        // Process telemetry
        await this.processTelemetry(payload.deviceId, device.zone, device.type, payload.data);

        res.status(200).json({ status: 'ok' });
      } catch (err) {
        log.error({ err: String(err) }, 'webhook handler error');
        
        // Queue for retry
        const payload = req.body as WebhookPayload;
        if (payload?.deviceId && payload?.data) {
          this.queueRetry(payload.deviceId, payload.data);
        }
        
        res.status(500).json({ error: 'Internal server error' });
      }
    };
  }

  /**
   * Validate HMAC-SHA256 signature.
   */
  private validateSignature(payload: WebhookPayload): boolean {
    const message = `${payload.deviceId}:${payload.timestamp}:${JSON.stringify(payload.data)}`;
    const expectedSignature = createHmac('sha256', this.secret)
      .update(message)
      .digest('hex');
    
    return payload.signature === expectedSignature;
  }

  /**
   * Process telemetry: normalize, append to ledger, broadcast via SSE.
   */
  private async processTelemetry(
    deviceId: string,
    zone: string,
    deviceType: string,
    data: unknown,
  ): Promise<void> {
    // Normalize telemetry
    const normalized = this.normalizer.normalize(deviceType as any, data);

    // Append to ledger
    const event = await this.ledger.append({
      eventType: 'iot.telemetry.received',
      zone: 'IOT',
      actor: `device:${deviceId}`,
      deviceId,
      payload: normalized,
    });

    // Broadcast via SSE
    this.broadcaster.broadcast(zone, {
      type: 'telemetry',
      deviceId,
      zoneId: zone,
      telemetry: normalized,
      timestamp: event.timestamp,
      anomaly: normalized.anomaly,
    });

    log.info(
      { deviceId, zone, anomaly: normalized.anomaly },
      'telemetry processed',
    );
  }

  /**
   * Queue failed telemetry for retry.
   */
  private queueRetry(deviceId: string, payload: unknown): void {
    this.retryQueue.push({ deviceId, payload, attempts: 0 });
    
    // Start retry with exponential backoff
    setTimeout(() => this.processRetryQueue(), 100);
  }

  /**
   * Process retry queue with exponential backoff (100ms, 200ms, 400ms).
   */
  private async processRetryQueue(): Promise<void> {
    while (this.retryQueue.length > 0) {
      const item = this.retryQueue.shift()!;
      
      if (item.attempts >= 3) {
        log.warn({ deviceId: item.deviceId }, 'retry attempts exhausted');
        continue;
      }

      try {
        const device = this.deviceRegistry.get(item.deviceId);
        if (!device) {
          log.warn({ deviceId: item.deviceId }, 'device not found during retry');
          continue;
        }

        await this.processTelemetry(item.deviceId, device.zone, device.type, item.payload);
        log.info({ deviceId: item.deviceId, attempts: item.attempts + 1 }, 'retry successful');
      } catch (err) {
        log.warn({ deviceId: item.deviceId, attempts: item.attempts + 1, err: String(err) }, 'retry failed');
        
        // Re-queue with incremented attempts
        item.attempts++;
        this.retryQueue.push(item);
        
        // Exponential backoff: 100ms, 200ms, 400ms
        const backoffMs = 100 * Math.pow(2, item.attempts - 1);
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
      }
    }
  }

  /**
   * Get retry queue size (for testing).
   */
  getRetryQueueSize(): number {
    return this.retryQueue.length;
  }

  /**
   * Reset rate limiter (for testing).
   */
  resetRateLimiter(): void {
    this.rateLimiter.reset();
  }
}
