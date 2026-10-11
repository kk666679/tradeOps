import { z } from "zod";
export const FizManufactureInput = z.object({
    tenantId: z.string(),
    workOrderId: z.string(),
    action: z.enum(["start", "complete", "hold"]),
    _meta: z.record(z.unknown()).optional(),
});
export async function handleFizManufacture(raw) {
    const input = FizManufactureInput.parse(raw);
    return {
        content: [{ type: "text", text: JSON.stringify({ ok: true, ...input, at: new Date().toISOString() }) }],
    };
}
//# sourceMappingURL=fiz.js.map