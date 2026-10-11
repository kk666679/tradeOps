// shared/schemas/meta.ts
// _meta keys and per-request metadata contracts for MCP 2026-07-28.
// In the stateless core, every request self-describes.

export const META_KEY = {
  PROTOCOL_VERSION:   "io.modelcontextprotocol/protocolVersion",
  CLIENT_CAPABILITIES:"io.modelcontextprotocol/clientCapabilities",
  CLIENT_INFO:        "io.modelcontextprotocol/clientInfo",
  LOG_LEVEL:          "io.modelcontextprotocol/logLevel",
  TRACE_PARENT:       "io.modelcontextprotocol/traceparent",
  TENANT_ID:          "io.tradeops/tenantId",
  ACTOR_ID:           "io.tradeops/actorId",
  AGENT_ID:           "io.tradeops/agentId",
  IDEMPOTENCY_KEY:    "io.tradeops/idempotencyKey",
} as const;

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface ClientInfo {
  name: string;
  version: string;
}

export interface ClientCapabilities {
  extensions?: string[];
  mrtr?: boolean;
  ui?: boolean;
  tasks?: boolean;
}

export interface RequestMeta {
  protocolVersion: string;
  clientCapabilities: ClientCapabilities;
  clientInfo?: ClientInfo;
  logLevel: LogLevel;
  traceparent?: string;
  tenantId?: string;
  actorId?: string;
  agentId?: string;
  idempotencyKey?: string;
}

export function extractRequestMeta(rawMeta: Record<string, unknown> | undefined): RequestMeta {
  const meta = rawMeta ?? {};
  return {
    protocolVersion: String(meta[META_KEY.PROTOCOL_VERSION] ?? "2026-07-28"),
    clientCapabilities: (meta[META_KEY.CLIENT_CAPABILITIES] as ClientCapabilities) ?? {},
    clientInfo: meta[META_KEY.CLIENT_INFO] as ClientInfo | undefined,
    logLevel: (meta[META_KEY.LOG_LEVEL] as LogLevel) ?? "info",
    traceparent: meta[META_KEY.TRACE_PARENT] as string | undefined,
    tenantId: meta[META_KEY.TENANT_ID] as string | undefined,
    actorId: meta[META_KEY.ACTOR_ID] as string | undefined,
    agentId: meta[META_KEY.AGENT_ID] as string | undefined,
    idempotencyKey: meta[META_KEY.IDEMPOTENCY_KEY] as string | undefined,
  };
}

export function buildResultMeta(meta: RequestMeta): Record<string, unknown> {
  return {
    [META_KEY.PROTOCOL_VERSION]: meta.protocolVersion,
    [META_KEY.LOG_LEVEL]: meta.logLevel,
  };
}

export function assertProtocolVersion(meta: RequestMeta, supported: string[]): void {
  if (!supported.includes(meta.protocolVersion)) {
    throw new Error(
      `Unsupported protocolVersion=${meta.protocolVersion}; supported: ${supported.join(", ")}`,
    );
  }
}
