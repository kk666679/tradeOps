export const AGENTS_RESOURCE_URI = "tradeops://agents/{tenantId}";
export function listAgents(tenantId) {
    return [
        { agentId: "agent.customs", role: "customs", scopes: ["tradeops.core.read", "jkdm.classify.read"] },
        { agentId: "agent.ops", role: "ops", scopes: ["tradeops.core.read", "tradeops.gate.in"] },
    ].filter(() => Boolean(tenantId));
}
//# sourceMappingURL=agents.js.map