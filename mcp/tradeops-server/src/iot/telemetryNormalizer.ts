/**
 * Telemetry normalizer with anomaly detection.
 * Converts vendor-specific payloads to normalized format with threshold-based anomaly flagging.
 */

import type { DeviceType } from './deviceRegistry.js';

export interface NormalizedTelemetry {
  sensorValue: number;
  unit: string;
  anomaly: boolean;
  raw: unknown;
}

export interface ThresholdConfig {
  min: number;
  max: number;
  unit: string;
}

const DEFAULT_THRESHOLDS: Record<DeviceType, ThresholdConfig> = {
  rfid: { min: 0, max: 100, unit: 'signal_strength' },
  barcode: { min: 0, max: 100, unit: 'scan_quality' },
  gps: { min: -180, max: 180, unit: 'degrees' },
  sensor: { min: -50, max: 150, unit: 'celsius' },
  camera: { min: 0, max: 1, unit: 'confidence' },
};

export class TelemetryNormalizer {
  private thresholds: Record<DeviceType, ThresholdConfig>;

  constructor(customThresholds?: Partial<Record<DeviceType, ThresholdConfig>>) {
    this.thresholds = { ...DEFAULT_THRESHOLDS, ...customThresholds };
  }

  /**
   * Normalize vendor-specific telemetry to standard format.
   * Extracts numeric sensor value, applies thresholds, and flags anomalies.
   */
  normalize(deviceType: DeviceType, payload: unknown): NormalizedTelemetry {
    const threshold = this.thresholds[deviceType];
    const sensorValue = this.extractSensorValue(payload);
    const anomaly = sensorValue < threshold.min || sensorValue > threshold.max;

    return {
      sensorValue,
      unit: threshold.unit,
      anomaly,
      raw: payload,
    };
  }

  /**
   * Extract numeric sensor value from arbitrary payload.
   * Tries common field names, falls back to first numeric value found.
   */
  private extractSensorValue(payload: unknown): number {
    if (typeof payload === 'number') {
      return payload;
    }

    if (typeof payload === 'object' && payload !== null) {
      const obj = payload as Record<string, unknown>;
      
      // Try common field names
      const commonFields = ['value', 'sensorValue', 'reading', 'measurement', 'data', 'signal'];
      for (const field of commonFields) {
        if (field in obj && typeof obj[field] === 'number') {
          return obj[field] as number;
        }
      }

      // Fall back to first numeric value
      for (const value of Object.values(obj)) {
        if (typeof value === 'number') {
          return value;
        }
      }
    }

    // Default to 0 if no numeric value found
    return 0;
  }
}
