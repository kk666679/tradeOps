import { broadcast } from "../transport/subscriptions.js";
export function broadcastTelemetry(tenantId, event) {
    broadcast({
        kind: "resourceSubscriptions",
        uri: `iot://zone/${tenantId}`,
        payload: event,
    });
}
//# sourceMappingURL=sseBroadcaster.js.map