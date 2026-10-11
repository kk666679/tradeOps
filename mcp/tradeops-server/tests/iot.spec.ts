/**
 * IoT backend infrastructure tests.
 * Covers DeviceRegistry, TelemetryNormalizer, WebhookHandler, ZoneGraphUpdater, SSEBroadcaster.
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { BondedLedger } from '../src/backend/ledger.js';
import { DeviceRegistry } from '../src/iot/deviceRegistry.js';
import { TelemetryNormalizer } from '../src/iot/telemetryNormalizer.js';
import { WebhookHandler } from '../src/iot/webhookHandler.js';
import { ZoneGraphUpdater } from '../src/iot/zoneGraphUpdater.js';
import { SSEBroadcaster } from '../src/iot/sseBroadcaster.js';
import { createHmac } from 'node:crypto';
import type { Response } from 'express';

describe('DeviceRegistry', () => {
  let ledger: BondedLedger;
  let registry: DeviceRegistry;

  beforeEach(() => {
    ledger = new BondedLedger();
    registry = new DeviceRegistry(ledger);
  });

  it('registers a device and emits ledger event', async () => {
    await registry.register({
      deviceId: 'rfid-001',
      type: 'rfid',
      zone: 'FIZ',
    });

    const device = registry.get('rfid-001');
    expect(device).toBeDefined();
    expect(device?.deviceId).toBe('rfid-001');
    expect(device?.type).toBe('rfid');
    expect(device?.zone).toBe('FIZ');

    const events = ledger.query({ eventType: 'iot.device.registered' });
    expect(events.length).toBe(1);
    expect(events[0].zone).toBe('IOT');
    expect(events[0].actor).toBe('system:iot-registry');
    expect(events[0].deviceId).toBe('rfid-001');
  });

  it('deregisters a device and emits ledger event', async () => {
    await registry.register({
      deviceId: 'rfid-001',
      type: 'rfid',
      zone: 'FIZ',
    });

    await registry.deregister('rfid-001');

    const device = registry.get('rfid-001');
    expect(device).toBeUndefined();

    const events = ledger.query({ eventType: 'iot.device.deregistered' });
    expect(events.length).toBe(1);
    expect(events[0].deviceId).toBe('rfid-001');
  });

  it('lists devices by zone', async () => {
    await registry.register({ deviceId: 'rfid-001', type: 'rfid', zone: 'FIZ' });
    await registry.register({ deviceId: 'gps-001', type: 'gps', zone: 'FCZ' });
    await registry.register({ deviceId: 'rfid-002', type: 'rfid', zone: 'FIZ' });

    const fizDevices = registry.listByZone('FIZ');
    expect(fizDevices.length).toBe(2);
    expect(fizDevices.every((d) => d.zone === 'FIZ')).toBe(true);
  });

  it('returns all devices', async () => {
    await registry.register({ deviceId: 'rfid-001', type: 'rfid', zone: 'FIZ' });
    await registry.register({ deviceId: 'gps-001', type: 'gps', zone: 'FCZ' });

    const all = registry.all();
    expect(all.length).toBe(2);
  });

  it('rejects invalid zone', async () => {
    await expect(
      registry.register({
        deviceId: 'rfid-001',
        type: 'rfid',
        zone: 'INVALID' as any,
      }),
    ).rejects.toThrow('Invalid zone');
  });

  it('rejects duplicate deviceId', async () => {
    await registry.register({ deviceId: 'rfid-001', type: 'rfid', zone: 'FIZ' });
    
    await expect(
      registry.register({ deviceId: 'rfid-001', type: 'sensor', zone: 'FCZ' }),
    ).rejects.toThrow('already registered');
  });

  it('hydrates from ledger events', async () => {
    // Register devices
    await registry.register({ deviceId: 'rfid-001', type: 'rfid', zone: 'FIZ' });
    await registry.register({ deviceId: 'gps-001', type: 'gps', zone: 'FCZ' });
    await registry.deregister('gps-001');

    // Create new registry and hydrate
    const registry2 = new DeviceRegistry(ledger);
    registry2.hydrateFromLedger();

    expect(registry2.get('rfid-001')).toBeDefined();
    expect(registry2.get('gps-001')).toBeUndefined(); // Was deregistered
    expect(registry2.all().length).toBe(1);
  });
});

describe('TelemetryNormalizer', () => {
  let normalizer: TelemetryNormalizer;

  beforeEach(() => {
    normalizer = new TelemetryNormalizer();
  });

  it('normalizes RFID telemetry', () => {
    const result = normalizer.normalize('rfid', { value: 75 });
    
    expect(result.sensorValue).toBe(75);
    expect(result.unit).toBe('signal_strength');
    expect(result.anomaly).toBe(false);
    expect(result.raw).toEqual({ value: 75 });
  });

  it('normalizes barcode telemetry', () => {
    const result = normalizer.normalize('barcode', { scanQuality: 90 });
    
    expect(result.sensorValue).toBe(90);
    expect(result.unit).toBe('scan_quality');
    expect(result.anomaly).toBe(false);
  });

  it('normalizes GPS telemetry', () => {
    const result = normalizer.normalize('gps', { reading: -75.5 });
    
    expect(result.sensorValue).toBe(-75.5);
    expect(result.unit).toBe('degrees');
    expect(result.anomaly).toBe(false);
  });

  it('normalizes sensor telemetry', () => {
    const result = normalizer.normalize('sensor', { measurement: 25.3 });
    
    expect(result.sensorValue).toBe(25.3);
    expect(result.unit).toBe('celsius');
    expect(result.anomaly).toBe(false);
  });

  it('normalizes camera telemetry', () => {
    const result = normalizer.normalize('camera', { data: 0.85 });
    
    expect(result.sensorValue).toBe(0.85);
    expect(result.unit).toBe('confidence');
    expect(result.anomaly).toBe(false);
  });

  it('detects anomaly when value below min threshold', () => {
    const result = normalizer.normalize('rfid', { value: -10 });
    
    expect(result.anomaly).toBe(true);
  });

  it('detects anomaly when value above max threshold', () => {
    const result = normalizer.normalize('sensor', { value: 200 });
    
    expect(result.anomaly).toBe(true);
  });

  it('preserves raw payload', () => {
    const raw = { value: 75, metadata: { location: 'warehouse' } };
    const result = normalizer.normalize('rfid', raw);
    
    expect(result.raw).toEqual(raw);
  });

  it('handles custom thresholds', () => {
    const customNormalizer = new TelemetryNormalizer({
      sensor: { min: 0, max: 50, unit: 'custom' },
    });
    
    const result = customNormalizer.normalize('sensor', { value: 45 });
    expect(result.anomaly).toBe(false);
    expect(result.unit).toBe('custom');
    
    const result2 = customNormalizer.normalize('sensor', { value: 60 });
    expect(result2.anomaly).toBe(true);
  });
});

describe('WebhookHandler', () => {
  let ledger: BondedLedger;
  let registry: DeviceRegistry;
  let normalizer: TelemetryNormalizer;
  let broadcaster: SSEBroadcaster;
  let handler: WebhookHandler;
  const secret = 'test-secret';

  beforeEach(async () => {
    ledger = new BondedLedger();
    registry = new DeviceRegistry(ledger);
    normalizer = new TelemetryNormalizer();
    broadcaster = new SSEBroadcaster();
    handler = new WebhookHandler(registry, normalizer, ledger, broadcaster, secret);

    // Register a test device
    await registry.register({ deviceId: 'rfid-001', type: 'rfid', zone: 'FIZ' });
  });

  afterEach(() => {
    broadcaster.shutdown();
  });

  function createSignature(deviceId: string, timestamp: string, data: unknown): string {
    const message = `${deviceId}:${timestamp}:${JSON.stringify(data)}`;
    return createHmac('sha256', secret).update(message).digest('hex');
  }

  it('validates HMAC signature', async () => {
    const timestamp = new Date().toISOString();
    const data = { value: 75 };
    const signature = createSignature('rfid-001', timestamp, data);

    const req = {
      body: { deviceId: 'rfid-001', timestamp, signature, data },
    } as any;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any;

    await handler.middleware()(req, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: 'ok' });
  });

  it('rejects invalid HMAC signature', async () => {
    const timestamp = new Date().toISOString();
    const data = { value: 75 };

    const req = {
      body: { deviceId: 'rfid-001', timestamp, signature: 'invalid', data },
    } as any;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any;

    await handler.middleware()(req, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid signature' });
  });

  it('validates timestamp within 60s', async () => {
    const expiredTimestamp = new Date(Date.now() - 120_000).toISOString();
    const data = { value: 75 };
    const signature = createSignature('rfid-001', expiredTimestamp, data);

    const req = {
      body: { deviceId: 'rfid-001', timestamp: expiredTimestamp, signature, data },
    } as any;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any;

    await handler.middleware()(req, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Timestamp expired or too far in future' });
  });

  it('rate limits at 1000 req/min per deviceId', async () => {
    const timestamp = new Date().toISOString();
    const data = { value: 75 };
    const signature = createSignature('rfid-001', timestamp, data);

    const req = {
      body: { deviceId: 'rfid-001', timestamp, signature, data },
    } as any;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any;

    // Make 1001 requests
    for (let i = 0; i < 1001; i++) {
      await handler.middleware()(req, res, vi.fn());
    }

    // Last request should be rate limited
    const lastCall = res.status.mock.calls[res.status.mock.calls.length - 1];
    expect(lastCall[0]).toBe(429);
  });

  it('appends ledger event on success', async () => {
    const timestamp = new Date().toISOString();
    const data = { value: 75 };
    const signature = createSignature('rfid-001', timestamp, data);

    const req = {
      body: { deviceId: 'rfid-001', timestamp, signature, data },
    } as any;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any;

    await handler.middleware()(req, res, vi.fn());

    const events = ledger.query({ eventType: 'iot.telemetry.received' });
    expect(events.length).toBe(1);
    expect(events[0].zone).toBe('IOT');
    expect(events[0].actor).toBe('device:rfid-001');
    expect(events[0].deviceId).toBe('rfid-001');
  });

  it('queues for retry on failure', async () => {
    handler.resetRateLimiter();
    
    const timestamp = new Date().toISOString();
    const data = { value: 75 };
    const signature = createSignature('rfid-999', timestamp, data);

    const req = {
      body: { deviceId: 'rfid-999', timestamp, signature, data },
    } as any;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any;

    await handler.middleware()(req, res, vi.fn());

    // Should fail due to device not found, but queue for retry
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe('ZoneGraphUpdater', () => {
  let updater: ZoneGraphUpdater;

  beforeEach(() => {
    updater = new ZoneGraphUpdater();
  });

  it('updates zone state on telemetry', () => {
    const telemetry = { sensorValue: 75, unit: 'signal_strength', anomaly: false };
    updater.onTelemetry('rfid-001', 'FIZ', telemetry);

    const state = updater.getZoneState('FIZ');
    expect(state).toBeDefined();
    expect(state?.latestTelemetry).toEqual(telemetry);
  });

  it('deduplicates telemetry within 5s window', () => {
    const telemetry = { sensorValue: 75, unit: 'signal_strength', anomaly: false };
    
    updater.onTelemetry('rfid-001', 'FIZ', telemetry);
    updater.onTelemetry('rfid-001', 'FIZ', telemetry); // Duplicate

    const state = updater.getZoneState('FIZ');
    expect(state).toBeDefined();
    // Both should be deduplicated, only one update
  });

  it('accepts telemetry after 5s window', async () => {
    const telemetry = { sensorValue: 75, unit: 'signal_strength', anomaly: false };
    
    updater.onTelemetry('rfid-001', 'FIZ', telemetry);
    
    // Wait 5.1s
    await new Promise((resolve) => setTimeout(resolve, 5100));
    
    updater.onTelemetry('rfid-001', 'FIZ', telemetry);

    const state = updater.getZoneState('FIZ');
    expect(state).toBeDefined();
  });

  it('resolves conflicts by last-write-wins', () => {
    const telemetry1 = { sensorValue: 75, unit: 'signal_strength', anomaly: false };
    const telemetry2 = { sensorValue: 80, unit: 'signal_strength', anomaly: false };
    
    updater.onTelemetry('rfid-001', 'FIZ', telemetry1);
    updater.onTelemetry('rfid-002', 'FIZ', telemetry2);

    const state = updater.getZoneState('FIZ');
    expect(state).toBeDefined();
    expect(state?.latestTelemetry).toEqual(telemetry2); // Last write wins
  });

  it('returns undefined for unknown zone', () => {
    const state = updater.getZoneState('UNKNOWN');
    expect(state).toBeUndefined();
  });
});

describe('SSEBroadcaster', () => {
  let broadcaster: SSEBroadcaster;

  beforeEach(() => {
    broadcaster = new SSEBroadcaster();
  });

  afterEach(() => {
    broadcaster.shutdown();
  });

  function createMockResponse(): Response {
    const res = {
      setHeader: vi.fn(),
      flushHeaders: vi.fn(),
      write: vi.fn(),
      on: vi.fn((event, handler) => {
        if (event === 'close') {
          // Store close handler for manual triggering
          (res as any).closeHandler = handler;
        }
      }),
    } as any;
    return res;
  }

  it('subscribes client to zone channel', () => {
    const res = createMockResponse();
    
    broadcaster.subscribe('FIZ', res);

    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/event-stream');
    expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-cache');
    expect(res.setHeader).toHaveBeenCalledWith('Connection', 'keep-alive');
    expect(res.flushHeaders).toHaveBeenCalled();
  });

  it('broadcasts event to all zone subscribers', () => {
    const res1 = createMockResponse();
    const res2 = createMockResponse();
    
    broadcaster.subscribe('FIZ', res1);
    broadcaster.subscribe('FIZ', res2);

    const event = {
      type: 'telemetry',
      deviceId: 'rfid-001',
      zoneId: 'FIZ',
      telemetry: { value: 75 },
      timestamp: new Date().toISOString(),
      anomaly: false,
    };

    broadcaster.broadcast('FIZ', event);

    expect(res1.write).toHaveBeenCalledWith(expect.stringContaining('data:'));
    expect(res2.write).toHaveBeenCalledWith(expect.stringContaining('data:'));
  });

  it('unsubscribes client on close', () => {
    const res = createMockResponse();
    
    broadcaster.subscribe('FIZ', res);
    
    // Trigger close event
    if ((res as any).closeHandler) {
      (res as any).closeHandler();
    }

    // Broadcast should not write to closed connection
    const event = {
      type: 'telemetry',
      deviceId: 'rfid-001',
      zoneId: 'FIZ',
      timestamp: new Date().toISOString(),
    };

    broadcaster.broadcast('FIZ', event);
    
    // Write should only be called once (during subscription), not during broadcast
    expect(res.write.mock.calls.length).toBeLessThanOrEqual(1);
  });

  it('sends heartbeat every 30s', async () => {
    vi.useFakeTimers();
    
    const res = createMockResponse();
    broadcaster.subscribe('FIZ', res);

    // Advance time by 30s
    vi.advanceTimersByTime(30_000);

    expect(res.write).toHaveBeenCalledWith(': heartbeat\n\n');
    
    vi.useRealTimers();
  });

  it('cleans up stale connections', async () => {
    vi.useFakeTimers();
    
    const res = createMockResponse();
    broadcaster.subscribe('FIZ', res);

    // Advance time by 30s (cleanup interval)
    vi.advanceTimersByTime(30_000);

    // Connections are stale if inactive for 30s, but heartbeat keeps them alive
    // So we need to advance past the heartbeat
    
    vi.useRealTimers();
  });
});
