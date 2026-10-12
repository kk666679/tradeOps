// backend/mcp/servers/tradeops/src/iot/sseBroadcaster.ts
// Deprecated in favour of `subscriptions/listen` (see transport/subscriptions.ts).
// This file remains a thin compatibility shim that forwards to the new path.

import { broadcast } from "../transport/subscriptions.js";

export function broadcastTelemetry(tenantId: string, event: unknown): void {
  broadcast({
    kind: "resourceSubscriptions",
    uri: `iot://zone/${tenantId}`,
    payload: event,
  });
}
