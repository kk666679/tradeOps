const devices = new Map();
export function registerDevice(d) {
    devices.set(d.deviceId, d);
}
export function listDevices(tenantId) {
    return [...devices.values()].filter((d) => d.tenantId === tenantId);
}
export function getDevice(tenantId, deviceId) {
    const d = devices.get(deviceId);
    if (!d)
        return undefined;
    if (d.tenantId !== tenantId)
        return undefined;
    return d;
}
//# sourceMappingURL=deviceRegistry.js.map