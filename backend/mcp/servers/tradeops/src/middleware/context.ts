// backend/mcp/servers/tradeops/src/middleware/context.ts

import type { RequestMeta } from "../types/index.js";
import { extractRequestMeta } from "../transport/headers.js";

export function enrichContext(rawParams: { _meta?: Record<string, unknown> }): RequestMeta {
  return extractRequestMeta(rawParams?._meta);
}
