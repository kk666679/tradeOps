/**
 * Zone graph updater with deduplication and conflict resolution.
 * Maintains latest telemetry state per zone with last-write-wins semantics.
 */

import { logger } from '../logger.js';

const log = logger.child({ component: 'zoneGraphUpdater' });

export interface ZoneState {
  latestTelemetry: unknown;
  updatedAt: string;
}

interface DeduplicationEntry {
  timestamp: number;
}

export class ZoneGraphUpdater {
  private zoneStates = new Map<string, ZoneState>();
  private deduplicationMap = new Map<string, DeduplicationEntry>();
  private readonly deduplicationWindowMs = 5_000;

  /**
   * Process incoming telemetry event.
   * Updates zone state if not a duplicate within 5s window.
   */
  onTelemetry(deviceId: string, zone: string, telemetry: unknown): void {
    // Extract sensor value for deduplication key
    const sensorValue = this.extractSensorValue(telemetry);
    const eventType = 'telemetry'; // Can be extended based on telemetry type
    
    // Check for duplicates
    if (this.isDuplicate(deviceId, eventType, sensorValue)) {
      log.debug({ deviceId, zone }, 'duplicate telemetry ignored');
      return;
    }

    // Update zone state (last-write-wins)
    const timestamp = new Date().toISOString();
    const existingState = this.zoneStates.get(zone);
    
    if (!existingState || new Date(timestamp) > new Date(existingState.updatedAt)) {
      this.zoneStates.set(zone, {
        latestTelemetry: telemetry,
        updatedAt: timestamp,
      });
      
      log.info({ deviceId, zone }, 'zone state updated');
    } else {
      log.debug({ deviceId, zone }, 'stale telemetry ignored (conflict resolution)');
    }
  }

  /**
   * Get current state for a zone.
   */
  getZoneState(zoneId: string): ZoneState | undefined {
    return this.zoneStates.get(zoneId);
  }



  /**
   * Check if telemetry is a duplicate within 5s window.
   */
  private isDuplicate(deviceId: string, eventType: string, value: number): boolean {
    const key = `${deviceId}:${eventType}:${value}`;
    const now = Date.now();
    const entry = this.deduplicationMap.get(key);

    if (entry && now - entry.timestamp < this.deduplicationWindowMs) {
      return true;
    }

    // Update deduplication map
    this.deduplicationMap.set(key, { timestamp: now });

    // Cleanup old entries (older than window)
    for (const [mapKey, mapEntry] of this.deduplicationMap.entries()) {
      if (now - mapEntry.timestamp > this.deduplicationWindowMs) {
        this.deduplicationMap.delete(mapKey);
      }
    }

    return false;
  }

  /**
   * Extract numeric sensor value from telemetry for deduplication.
   */
  private extractSensorValue(telemetry: unknown): number {
    if (typeof telemetry === 'number') {
      return telemetry;
    }

    if (typeof telemetry === 'object' && telemetry !== null) {
      const obj = telemetry as Record<string, unknown>;
      
      // Try common field names
      if ('sensorValue' in obj && typeof obj.sensorValue === 'number') {
        return obj.sensorValue;
      }
      
      if ('value' in obj && typeof obj.value === 'number') {
        return obj.value;
      }

      // Fall back to first numeric value
      for (const value of Object.values(obj)) {
        if (typeof value === 'number') {
          return value;
        }
      }
    }

    return 0;
  }

  /**
   * Get all zone states (for testing).
   */
  getAllZoneStates(): Map<string, ZoneState> {
    return new Map(this.zoneStates);
  }

  /**
   * Reset state (for testing).
   */
  reset(): void {
    this.zoneStates.clear();
    this.deduplicationMap.clear();
  }
}
