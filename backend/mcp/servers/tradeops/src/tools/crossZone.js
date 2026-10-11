import { z } from "zod";
export const CrossZoneMoveInput = z.object({
    tenantId: z.string(),
    containerId: z.string(),
    fromZone: z.enum(["CFS", "FIZ", "FCZ"]),
    toZone: z.enum(["CFS", "FIZ", "FCZ"]),
    _meta: z.record(z.unknown()).optional(),
});
export async function handleCrossZoneMove(raw) {
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
//# sourceMappingURL=crossZone.js.map