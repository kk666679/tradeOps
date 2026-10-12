// backend/mcp/servers/tradeops/src/backend/client.ts
// Thin wrapper for the internal TradeOps backend. Uses fetch, no session.

import { config } from "../config.js";

export interface BackendRequest {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  tenantId: string;
  actorId: string;
  body?: unknown;
  idempotencyKey?: string;
}

export async function callBackend<T>(req: BackendRequest): Promise<T> {
  const base = process.env.BACKEND_URL ?? "http://localhost:3000";
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Tenant-Id": req.tenantId,
    "X-Actor-Id": req.actorId,
  };
  if (req.idempotencyKey) headers["Idempotency-Key"] = req.idempotencyKey;

  const res = await fetch(`${base}${req.path}`, {
    method: req.method,
    headers,
    body: req.body ? JSON.stringify(req.body) : undefined,
  });
  if (!res.ok) throw new Error(`backend ${req.method} ${req.path} → ${res.status}`);
  return (await res.json()) as T;
}
