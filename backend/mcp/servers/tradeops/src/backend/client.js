export async function callBackend(req) {
    const base = process.env.BACKEND_URL ?? "http://localhost:3000";
    const headers = {
        "Content-Type": "application/json",
        "X-Tenant-Id": req.tenantId,
        "X-Actor-Id": req.actorId,
    };
    if (req.idempotencyKey)
        headers["Idempotency-Key"] = req.idempotencyKey;
    const res = await fetch(`${base}${req.path}`, {
        method: req.method,
        headers,
        body: req.body ? JSON.stringify(req.body) : undefined,
    });
    if (!res.ok)
        throw new Error(`backend ${req.method} ${req.path} → ${res.status}`);
    return (await res.json());
}
//# sourceMappingURL=client.js.map