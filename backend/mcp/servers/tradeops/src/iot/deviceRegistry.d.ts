export interface DeviceRecord {
    deviceId: string;
    tenantId: string;
    kind: "weighbridge" | "anpr" | "rfid" | "gate-controller";
    zone: "CFS" | "FIZ" | "FCZ";
    lastSeen: string;
    status: "online" | "offline" | "degraded";
}
export declare function registerDevice(d: DeviceRecord): void;
export declare function listDevices(tenantId: string): DeviceRecord[];
export declare function getDevice(tenantId: string, deviceId: string): DeviceRecord | undefined;
