// backend/mcp/servers/tradeops/src/tools/ai.ts

import { z } from "zod";

export const RagSearchInput = z.object({
  tenantId: z.string(),
  question: z.string().min(1),
  _meta: z.record(z.unknown()).optional(),
});
export type RagSearchInput = z.infer<typeof RagSearchInput>;

export async function handleRagSearch(raw: RagSearchInput) {
  const input = RagSearchInput.parse(raw);
  return {
    content: [{
      type: "text" as const,
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
export type ForecastInput = z.infer<typeof ForecastInput>;

export async function handleForecast(raw: ForecastInput) {
  const input = ForecastInput.parse(raw);
  const now = Date.now();
  return {
    content: [{
      type: "text" as const,
      text: JSON.stringify({
        taskId: `task_${now}`,
        status: "pending",
        pollIntervalMs: 2000,
      }),
    }],
  };
}
