import { normalize } from "./telemetryNormalizer.js";
import { broadcastTelemetry } from "./sseBroadcaster.js";
import { logger } from "../logger.js";
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