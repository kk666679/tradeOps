export interface RawTelemetry {
    deviceId: string;
    tenantId: string;
    kind: string;
    at: string;
    payload: Record<string, unknown>;
}
export interface NormalizedTelemetry {
    deviceId: string;
    tenantId: string;
    kind: "weight" | "plate" | "rfid" | "gate" | "unknown";
    at: string;
    value: number | string;
    unit?: string;
    meta: Record<string, unknown>;
}
export declare function normalize(raw: RawTelemetry): NormalizedTelemetry;
