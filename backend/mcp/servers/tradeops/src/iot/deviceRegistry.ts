// backend/mcp/servers/tradeops/src/iot/deviceRegistry.ts

export interface DeviceRecord {
  deviceId: string;
  tenantId: string;
  kind: "weighbridge" | "anpr" | "rfid" | "gate-controller";
  zone: "CFS" | "FIZ" | "FCZ";
  lastSeen: string;
  status: "online" | "offline" | "degraded";
}

const devices = new Map<string, DeviceRecord>();

export function registerDevice(d: DeviceRecord): void {
  devices.set(d.deviceId, d);
}

export function listDevices(tenantId: string): DeviceRecord[] {
  return [...devices.values()].filter((d) => d.tenantId === tenantId);
}

export function getDevice(tenantId: string, deviceId: string): DeviceRecord | undefined {
  const d = devices.get(deviceId);
  if (!d) return undefined;
  if (d.tenantId !== tenantId) return undefined; // enforce tenant isolation
  return d;
}
