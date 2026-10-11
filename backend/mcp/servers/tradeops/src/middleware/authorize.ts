// backend/mcp/servers/tradeops/src/middleware/authorize.ts

import type { ActorContext } from "../types";
import { assertScope } from "../auth/rbac";

export function authorize(actor: ActorContext, requiredScope: string): void {
  assertScope(actor, requiredScope);
}
