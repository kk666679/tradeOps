export function authenticate(meta) {
    if (!meta.tenantId)
        throw new Error("authenticate: missing tenantId in _meta");
    if (!meta.actorId)
        throw new Error("authenticate: missing actorId in _meta");
}
//# sourceMappingURL=authenticate.js.map