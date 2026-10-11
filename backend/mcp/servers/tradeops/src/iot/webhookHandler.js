import { normalize } from "./telemetryNormalizer";
import { broadcastTelemetry } from "./sseBroadcaster";
import { logger } from "../logger";
export async function handleIotWebhook(body) {
    const raw = body;
    if (!raw?.deviceId || !raw?.tenantId)
        throw new Error("iot webhook: missing deviceId or tenantId");
    const normalized = normalize(raw);
    broadcastTelemetry(raw.tenantId, normalized);
    logger.debug("iot.webhook.normalized", { tenantId: raw.tenantId, deviceId: raw.deviceId, kind: normalized.kind });
    return { ok: true };
}
//# sourceMappingURL=webhookHandler.js.map