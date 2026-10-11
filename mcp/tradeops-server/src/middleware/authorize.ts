/**
 * Middleware gate 2 - authorize (RBAC).
 *
 * Pure gate: given the request context and a tool name, decide whether the
 * caller role may invoke it. Transport-agnostic so stdio and HTTP share the
 * exact same check. Admin bypasses; unknown tools default to the most
 * restrictive tier so a tool registered without a tier cannot be silently
 * opened up.
 */

import { authorizeTool } from '../auth/rbac.js';
import type { RequestContext } from './context.js';

export interface GateResult {
  ok: boolean;
  code?: string;
  message?: string;
  details?: unknown;
}

export function authorizeCall(ctx: RequestContext, tool: string): GateResult {
  const decision = authorizeTool(ctx.role, tool);
  if (decision.allowed) return { ok: true };
  return {
    ok: false,
    code: 'forbidden',
    message: decision.reason ?? 'Access denied',
    details: { tool, requiredRole: decision.requiredRole, role: ctx.role },
  };
}