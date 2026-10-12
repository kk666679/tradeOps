// backend/mcp/servers/tradeops/src/middleware/authorize.ts

import type { ActorContext } from "../types/index.js";
import { assertScope } from "../auth/rbac.js";

export function authorize(actor: ActorContext, requiredScope: string): void {
  assertScope(actor, requiredScope);
}
