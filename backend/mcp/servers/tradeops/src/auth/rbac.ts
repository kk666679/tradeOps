// backend/mcp/servers/tradeops/src/auth/rbac.ts

import type { ActorContext } from "../types/index.js";

export const ROLE_SCOPES: Record<ActorContext["role"], string[]> = {
  SUPER_ADMIN:     ["*"],
  ADMIN:           ["tradeops.*", "jkdm.*", "compliance.*", "governance.*", "iot.*"],
  OPS_MANAGER:     ["tradeops.core.*", "tradeops.gate.*", "iot.*"],
  WAREHOUSE_STUFF: ["tradeops.core.read", "tradeops.gate.in", "tradeops.gate.out"],
  CUSTOMER:        ["tradeops.core.read"],
  AGENT:           [],
};

export function hasScope(actor: ActorContext, required: string): boolean {
  const granted = new Set<string>();
  for (const r of ROLE_SCOPES[actor.role]) {
    if (r === "*") return true;
    granted.add(r);
  }
  for (const s of actor.scopes) {
    if (s === "*") return true;
    granted.add(s);
  }
  if (granted.has(required)) return true;
  const parts = required.split(".");
  for (let i = parts.length - 1; i >= 1; i--) {
    if (granted.has(parts.slice(0, i).join(".") + ".*")) return true;
  }
  return false;
}

export function assertScope(actor: ActorContext, required: string): void {
  if (!hasScope(actor, required)) {
    throw new Error(`missing required scope: ${required}`);
  }
}
