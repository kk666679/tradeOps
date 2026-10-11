// backend/mcp/servers/tradeops/src/tools/agents.ts

import { z } from "zod";
import { listAgents } from "../resources/agents";

export const ListAgentsInput = z.object({
  tenantId: z.string(),
  _meta: z.record(z.unknown()).optional(),
});
export type ListAgentsInput = z.infer<typeof ListAgentsInput>;

export async function handleListAgents(raw: ListAgentsInput) {
  const input = ListAgentsInput.parse(raw);
  return { content: [{ type: "text", text: JSON.stringify(listAgents(input.tenantId)) }] };
}
