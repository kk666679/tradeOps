// backend/mcp/servers/tradeops/src/iot/webhookHandler.ts

import { normalize, type RawTelemetry } from "./telemetryNormalizer";
import { broadcastTelemetry } from "./sseBroadcaster";
import { logger } from "../logger";

export async function handleIotWebhook(body: unknown): Promise<{ ok: true }> {
  const raw = body as RawTelemetry;
  if (!raw?.deviceId || !raw?.tenantId) throw new Error("iot webhook: missing deviceId or tenantId");
  const normalized = normalize(raw);
  broadcastTelemetry(raw.tenantId, normalized);
  logger.debug("iot.webhook.normalized", { tenantId: raw.tenantId, deviceId: raw.deviceId, kind: normalized.kind });
  return { ok: true };
}
