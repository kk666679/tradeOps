import { broadcast } from "../transport/subscriptions";
export function broadcastTelemetry(tenantId, event) {
    broadcast({
        kind: "resourceSubscriptions",
        uri: `iot://zone/${tenantId}`,
        payload: event,
    });
}
//# sourceMappingURL=sseBroadcaster.js.map