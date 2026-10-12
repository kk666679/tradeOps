// backend/mcp/servers/tradeops/src/iot/webhookHandler.ts

import { normalize, type RawTelemetry } from "./telemetryNormalizer.js";
import { broadcastTelemetry } from "./sseBroadcaster.js";
import { logger } from "../logger.js";

export async function handleIotWebhook(body: unknown): Promise<{ ok: true }> {
  const raw = body as RawTelemetry;
  if (!raw?.deviceId || !raw?.tenantId) throw new Error("iot webhook: missing deviceId or tenantId");
  const normalized = normalize(raw);
  broadcastTelemetry(raw.tenantId, normalized);
  logger.debug("iot.webhook.normalized", { tenantId: raw.tenantId, deviceId: raw.deviceId, kind: normalized.kind });
  return { ok: true };
}
