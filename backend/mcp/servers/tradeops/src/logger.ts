// backend/mcp/servers/tradeops/src/logger.ts

import { config } from "./config.js";

type Level = "debug" | "info" | "warn" | "error";

const LEVEL_RANK: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 };

function currentLevel(): Level {
  const raw = (process.env.MCP_LOG_LEVEL ?? "info").toLowerCase();
  return (raw in LEVEL_RANK ? raw : "info") as Level;
}

const REDACT = new Set([
  "password", "token", "secret", "authorization", "apiKey", "apikey",
  "jwt", "accessToken", "refreshToken", "cookie", "set-cookie",
]);

function redact(value: unknown): unknown {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(redact);
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    out[k] = REDACT.has(k.toLowerCase()) ? "[REDACTED]" : redact(v);
  }
  return out;
}

export interface LogFields {
  tenantId?: string;
  actorId?: string;
  agentId?: string;
  tool?: string;
  traceId?: string;
  [key: string]: unknown;
}

export const logger = {
  log(level: Level, message: string, fields: LogFields = {}): void {
    if (LEVEL_RANK[level] < LEVEL_RANK[currentLevel()]) return;
    const line = JSON.stringify({
      ts: new Date().toISOString(),
      level,
      service: config.serverName,
      version: config.serverVersion,
      message,
      ...(redact(fields) as Record<string, unknown>),
    });
    process.stderr.write(line + "\n");
  },
  debug: (m: string, f?: LogFields) => logger.log("debug", m, f),
  info:  (m: string, f?: LogFields) => logger.log("info",  m, f),
  warn:  (m: string, f?: LogFields) => logger.log("warn",  m, f),
  error: (m: string, f?: LogFields) => logger.log("error", m, f),
};
