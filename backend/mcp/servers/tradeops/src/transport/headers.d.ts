import type { RequestMeta } from "../types";
export declare const META_KEY: {
    readonly PROTOCOL_VERSION: "io.modelcontextprotocol/protocolVersion";
    readonly CLIENT_CAPABILITIES: "io.modelcontextprotocol/clientCapabilities";
    readonly CLIENT_INFO: "io.modelcontextprotocol/clientInfo";
    readonly LOG_LEVEL: "io.modelcontextprotocol/logLevel";
    readonly TRACE_PARENT: "io.modelcontextprotocol/traceparent";
    readonly TENANT_ID: "io.tradeops/tenantId";
    readonly ACTOR_ID: "io.tradeops/actorId";
    readonly AGENT_ID: "io.tradeops/agentId";
    readonly IDEMPOTENCY_KEY: "io.tradeops/idempotencyKey";
};
export declare function extractRequestMeta(rawMeta: Record<string, unknown> | undefined): RequestMeta;
