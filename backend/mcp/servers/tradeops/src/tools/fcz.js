import { z } from "zod";
export const FczTradeInput = z.object({
    tenantId: z.string(),
    containerId: z.string(),
    operation: z.enum(["in", "out", "re-export"]),
    _meta: z.record(z.unknown()).optional(),
});
export async function handleFczTrade(raw) {
    const input = FczTradeInput.parse(raw);
    return {
        content: [{ type: "text", text: JSON.stringify({ ok: true, ...input, at: new Date().toISOString() }) }],
    };
}
//# sourceMappingURL=fcz.js.map