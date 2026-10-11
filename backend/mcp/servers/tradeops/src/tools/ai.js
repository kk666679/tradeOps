import { z } from "zod";
export const RagSearchInput = z.object({
    tenantId: z.string(),
    question: z.string().min(1),
    _meta: z.record(z.unknown()).optional(),
});
export async function handleRagSearch(raw) {
    const input = RagSearchInput.parse(raw);
    return {
        content: [{
                type: "text",
                text: JSON.stringify({
                    answer: null,
                    sources: [],
                    note: "no answer — retrieval returned nothing above threshold",
                    tenantId: input.tenantId,
                }),
            }],
    };
}
export const ForecastInput = z.object({
    tenantId: z.string(),
    horizonWeeks: z.number().int().positive(),
    _meta: z.record(z.unknown()).optional(),
});
export async function handleForecast(raw) {
    const input = ForecastInput.parse(raw);
    const now = Date.now();
    return {
        content: [{
                type: "text",
                text: JSON.stringify({
                    taskId: `task_${now}`,
                    status: "pending",
                    pollIntervalMs: 2000,
                }),
            }],
    };
}
//# sourceMappingURL=ai.js.map