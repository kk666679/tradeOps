export function normalize(raw) {
    switch (raw.kind) {
        case "weight":
            return { deviceId: raw.deviceId, tenantId: raw.tenantId, kind: "weight",
                at: raw.at, value: Number(raw.payload.kg ?? 0), unit: "kg", meta: {} };
        case "plate":
            return { deviceId: raw.deviceId, tenantId: raw.tenantId, kind: "plate",
                at: raw.at, value: String(raw.payload.plate ?? ""), meta: { confidence: raw.payload.confidence } };
        case "rfid":
            return { deviceId: raw.deviceId, tenantId: raw.tenantId, kind: "rfid",
                at: raw.at, value: String(raw.payload.tag ?? ""), meta: {} };
        case "gate":
            return { deviceId: raw.deviceId, tenantId: raw.tenantId, kind: "gate",
                at: raw.at, value: String(raw.payload.state ?? "unknown"), meta: {} };
        default:
            return { deviceId: raw.deviceId, tenantId: raw.tenantId, kind: "unknown",
                at: raw.at, value: JSON.stringify(raw.payload), meta: {} };
    }
}
//# sourceMappingURL=telemetryNormalizer.js.map