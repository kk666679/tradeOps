// backend/mcp/servers/tradeops/src/transport/headers.ts

import type { RequestMeta, LogLevel } from "../types";

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
} as const;

export function extractRequestMeta(rawMeta: Record<string, unknown> | undefined): RequestMeta {
  const meta = rawMeta ?? {};
  return {
    protocolVersion: String(meta[META_KEY.PROTOCOL_VERSION] ?? "2026-07-28"),
    clientCapabilities: (meta[META_KEY.CLIENT_CAPABILITIES] as Record<string, unknown>) ?? {},
    clientInfo: meta[META_KEY.CLIENT_INFO] as RequestMeta["clientInfo"],
    logLevel: (meta[META_KEY.LOG_LEVEL] as LogLevel) ?? "info",
    traceparent: meta[META_KEY.TRACE_PARENT] as string | undefined,
    tenantId: meta[META_KEY.TENANT_ID] as string | undefined,
    actorId: meta[META_KEY.ACTOR_ID] as string | undefined,
    agentId: meta[META_KEY.AGENT_ID] as string | undefined,
    idempotencyKey: meta[META_KEY.IDEMPOTENCY_KEY] as string | undefined,
  };
}
