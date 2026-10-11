// backend/mcp/servers/tradeops/src/tools/crossZone.ts

import { z } from "zod";

export const CrossZoneMoveInput = z.object({
  tenantId: z.string(),
  containerId: z.string(),
  fromZone: z.enum(["CFS", "FIZ", "FCZ"]),
  toZone: z.enum(["CFS", "FIZ", "FCZ"]),
  _meta: z.record(z.unknown()).optional(),
});
export type CrossZoneMoveInput = z.infer<typeof CrossZoneMoveInput>;

export async function handleCrossZoneMove(raw: CrossZoneMoveInput) {
  const input = CrossZoneMoveInput.parse(raw);
  return {
    content: [{
      type: "text",
      text: JSON.stringify({
        ok: true,
        containerId: input.containerId,
        from: input.fromZone,
        to: input.toZone,
        at: new Date().toISOString(),
      }),
    }],
  };
}
