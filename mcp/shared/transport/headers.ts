// shared/transport/headers.ts
// SEP-2243: mirror selected body fields into HTTP headers.

import type { Request, Response } from "express";
import { META_KEY } from "../schemas/meta";

export const HEADER = {
  PROTOCOL_VERSION: "Mcp-Protocol-Version",
  CLIENT_NAME: "Mcp-Client-Name",
  CLIENT_VERSION: "Mcp-Client-Version",
  LOG_LEVEL: "Mcp-Log-Level",
  TRACE_PARENT: "Traceparent",
} as const;

export function readHeaderMeta(req: Request): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (req.headers[HEADER.PROTOCOL_VERSION.toLowerCase()]) {
    out[META_KEY.PROTOCOL_VERSION] = req.headers[HEADER.PROTOCOL_VERSION.toLowerCase()];
  }
  if (req.headers[HEADER.LOG_LEVEL.toLowerCase()]) {
    out[META_KEY.LOG_LEVEL] = req.headers[HEADER.LOG_LEVEL.toLowerCase()];
  }
  if (req.headers[HEADER.TRACE_PARENT.toLowerCase()]) {
    out[META_KEY.TRACE_PARENT] = req.headers[HEADER.TRACE_PARENT.toLowerCase()];
  }
  return out;
}

export function writeHeaderMeta(res: Response, meta: Record<string, unknown>): void {
  const v = meta[META_KEY.PROTOCOL_VERSION];
  if (typeof v === "string") res.setHeader(HEADER.PROTOCOL_VERSION, v);
  const ll = meta[META_KEY.LOG_LEVEL];
  if (typeof ll === "string") res.setHeader(HEADER.LOG_LEVEL, ll);
}

export function assertHeaderBodyMatch(
  bodyMeta: Record<string, unknown>,
  headerMeta: Record<string, unknown>,
): void {
  for (const key of Object.keys(headerMeta)) {
    if (bodyMeta[key] !== undefined && bodyMeta[key] !== headerMeta[key]) {
      throw new Error(`SEP-2243 violation: header/body mismatch on ${key}`);
    }
  }
}
