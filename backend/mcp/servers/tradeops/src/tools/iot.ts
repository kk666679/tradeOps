// backend/mcp/servers/tradeops/src/tools/iot.ts

import { z } from "zod";
import { listDevices, getDevice } from "../iot/deviceRegistry";
import { getZoneGraph } from "../iot/zoneGraphUpdater";

export const DeviceStatusInput = z.object({
  tenantId: z.string(),
  deviceId: z.string().optional(),
  _meta: z.record(z.unknown()).optional(),
});
export type DeviceStatusInput = z.infer<typeof DeviceStatusInput>;

export async function handleDeviceStatus(raw: DeviceStatusInput) {
  const input = DeviceStatusInput.parse(raw);
  const payload = input.deviceId
    ? getDevice(input.tenantId, input.deviceId) ?? { error: "not found" }
    : listDevices(input.tenantId);
  return { content: [{ type: "text", text: JSON.stringify(payload) }] };
}

export const ZoneGraphInput = z.object({
  tenantId: z.string(),
  _meta: z.record(z.unknown()).optional(),
});
export type ZoneGraphInput = z.infer<typeof ZoneGraphInput>;

export async function handleZoneGraph(raw: ZoneGraphInput) {
  const input = ZoneGraphInput.parse(raw);
  return { content: [{ type: "text", text: JSON.stringify(getZoneGraph(input.tenantId)) }] };
}
