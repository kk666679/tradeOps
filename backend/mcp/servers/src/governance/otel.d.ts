export declare function initTracer(serviceName: string): void;
export interface ToolSpanAttributes {
    tenantId: string;
    actorId: string;
    agentId?: string;
    tool: string;
    ruleSetVersion?: string;
    extension?: "tasks" | "apps" | "skills";
}
export declare function withToolSpan<T>(attrs: ToolSpanAttributes, fn: () => Promise<T>): Promise<T>;
