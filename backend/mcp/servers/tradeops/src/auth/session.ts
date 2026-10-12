// backend/mcp/servers/tradeops/src/auth/session.ts
// Stateless core (2026-07-28): sessions do not exist. Each request carries
// its own identity via _meta. This module provides per-request context.

import type { RequestMeta, ActorContext, TenantContext } from "../types/index.js";

export interface RequestContext {
  meta: RequestMeta;
  tenant?: TenantContext;
  actor?: ActorContext;
}

export function buildRequestContext(meta: RequestMeta): RequestContext {
  return { meta };
}
