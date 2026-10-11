export declare const AGENTS_RESOURCE_URI = "tradeops://agents/{tenantId}";
export declare function listAgents(tenantId: string): Array<{
    agentId: string;
    role: string;
    scopes: string[];
}>;
