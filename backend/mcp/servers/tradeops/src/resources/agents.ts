// backend/mcp/servers/tradeops/src/resources/agents.ts

export const AGENTS_RESOURCE_URI = "tradeops://agents/{tenantId}";

export function listAgents(tenantId: string): Array<{ agentId: string; role: string; scopes: string[] }> {
  return [
    { agentId: "agent.customs", role: "customs", scopes: ["tradeops.core.read", "jkdm.classify.read"] },
    { agentId: "agent.ops",     role: "ops",     scopes: ["tradeops.core.read", "tradeops.gate.in"] },
  ].filter(() => Boolean(tenantId));
}
