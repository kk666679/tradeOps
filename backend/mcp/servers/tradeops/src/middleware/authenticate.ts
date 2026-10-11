// backend/mcp/servers/tradeops/src/middleware/authenticate.ts

import type { RequestMeta } from "../types";

export function authenticate(meta: RequestMeta): void {
  if (!meta.tenantId) throw new Error("authenticate: missing tenantId in _meta");
  if (!meta.actorId)  throw new Error("authenticate: missing actorId in _meta");
}
