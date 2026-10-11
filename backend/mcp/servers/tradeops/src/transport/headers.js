export const META_KEY = {
    PROTOCOL_VERSION: "io.modelcontextprotocol/protocolVersion",
    CLIENT_CAPABILITIES: "io.modelcontextprotocol/clientCapabilities",
    CLIENT_INFO: "io.modelcontextprotocol/clientInfo",
    LOG_LEVEL: "io.modelcontextprotocol/logLevel",
    TRACE_PARENT: "io.modelcontextprotocol/traceparent",
    TENANT_ID: "io.tradeops/tenantId",
    ACTOR_ID: "io.tradeops/actorId",
    AGENT_ID: "io.tradeops/agentId",
    IDEMPOTENCY_KEY: "io.tradeops/idempotencyKey",
};
export function extractRequestMeta(rawMeta) {
    const meta = rawMeta ?? {};
    return {
        protocolVersion: String(meta[META_KEY.PROTOCOL_VERSION] ?? "2026-07-28"),
        clientCapabilities: meta[META_KEY.CLIENT_CAPABILITIES] ?? {},
        clientInfo: meta[META_KEY.CLIENT_INFO],
        logLevel: meta[META_KEY.LOG_LEVEL] ?? "info",
        traceparent: meta[META_KEY.TRACE_PARENT],
        tenantId: meta[META_KEY.TENANT_ID],
        actorId: meta[META_KEY.ACTOR_ID],
        agentId: meta[META_KEY.AGENT_ID],
        idempotencyKey: meta[META_KEY.IDEMPOTENCY_KEY],
    };
}
//# sourceMappingURL=headers.js.map