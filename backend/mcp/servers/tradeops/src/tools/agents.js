import { z } from "zod";
import { listAgents } from "../resources/agents.js";
export const ListAgentsInput = z.object({
    tenantId: z.string(),
    _meta: z.record(z.unknown()).optional(),
});
export async function handleListAgents(raw) {
    const input = ListAgentsInput.parse(raw);
    return { content: [{ type: "text", text: JSON.stringify(listAgents(input.tenantId)) }] };
}
//# sourceMappingURL=agents.js.map