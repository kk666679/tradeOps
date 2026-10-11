/**
 * Device registry with ledger backing.
 * Maintains in-memory Map of devices, reconstructed from ledger events on startup.
 */

import type { BondedLedger } from '../backend/ledger.js';
import type { LedgerZone } from '../types/events.js';
import { LEDGER_ZONES } from '../types/events.js';
import { logger } from '../logger.js';

const log = logger.child({ component: 'deviceRegistry' });

export type DeviceType = 'rfid' | 'barcode' | 'gps' | 'sensor' | 'camera';

export interface Device {
  deviceId: string;
  type: DeviceType;
  zone: LedgerZone;
  metadata?: Record<string, unknown>;
}

export class DeviceRegistry {
  private devices = new Map<string, Device>();

  constructor(private readonly ledger: BondedLedger) {}

  /**
   * Register a new device. Emits ledger event with zone='IOT',
   * actor='system:iot-registry', eventType='iot.device.registered'.
   */
  async register(device: Device): Promise<void> {
    // Validate zone
    if (!LEDGER_ZONES.includes(device.zone)) {
      throw new Error(`Invalid zone: ${device.zone}. Must be one of: ${LEDGER_ZONES.join(', ')}`);
    }

    // Check for duplicate deviceId
    if (this.devices.has(device.deviceId)) {
      throw new Error(`Device ${device.deviceId} already registered`);
    }

    // Append to ledger
    await this.ledger.append({
      eventType: 'iot.device.registered',
      zone: 'IOT',
      actor: 'system:iot-registry',
      deviceId: device.deviceId,
      payload: device,
    });

    // Update in-memory map
    this.devices.set(device.deviceId, device);
    log.info({ deviceId: device.deviceId, zone: device.zone }, 'device registered');
  }

  /**
   * Deregister a device. Emits ledger event with zone='IOT',
   * actor='system:iot-registry', eventType='iot.device.deregistered'.
   */
  async deregister(deviceId: string): Promise<void> {
    const device = this.devices.get(deviceId);
    if (!device) {
      throw new Error(`Device ${deviceId} not found`);
    }

    // Append to ledger
    await this.ledger.append({
      eventType: 'iot.device.deregistered',
      zone: 'IOT',
      actor: 'system:iot-registry',
      deviceId,
      payload: { deviceId },
    });

    // Update in-memory map
    this.devices.delete(deviceId);
    log.info({ deviceId }, 'device deregistered');
  }

  /** Get a device by id. */
  get(deviceId: string): Device | undefined {
    return this.devices.get(deviceId);
  }

  /** List all devices in a given zone. */
  listByZone(zone: LedgerZone): Device[] {
    return Array.from(this.devices.values()).filter((d) => d.zone === zone);
  }

  /** Get all devices. */
  all(): Device[] {
    return Array.from(this.devices.values());
  }

  /**
   * Reconstruct the registry from ledger events.
   * Should be called on startup to hydrate the in-memory map.
   */
  hydrateFromLedger(): void {
    this.devices.clear();
    const events = this.ledger.query({ eventType: 'iot.device.registered' });
    const deregistered = new Set(
      this.ledger.query({ eventType: 'iot.device.deregistered' }).map((e) => e.deviceId),
    );

    for (const event of events) {
      if (event.deviceId && event.payload && !deregistered.has(event.deviceId)) {
        const device = event.payload as unknown as Device;
        this.devices.set(device.deviceId, device);
      }
    }

    log.info({ count: this.devices.size }, 'device registry hydrated from ledger');
  }
}
