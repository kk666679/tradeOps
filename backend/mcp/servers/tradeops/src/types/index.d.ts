export type LogLevel = "debug" | "info" | "warn" | "error";
export type ControlOutcome = "PASS" | "FAIL" | "REVIEW" | "NOT_APPLICABLE";
export type CustomsChannel = "GREEN" | "YELLOW" | "RED" | "UNASSIGNED";
export interface RequestMeta {
    protocolVersion: string;
    clientCapabilities: Record<string, unknown>;
    clientInfo?: {
        name: string;
        version: string;
    };
    logLevel: LogLevel;
    traceparent?: string;
    tenantId?: string;
    actorId?: string;
    agentId?: string;
    idempotencyKey?: string;
}
export interface TenantContext {
    tenantId: string;
    tenancyModel: "pool" | "silo" | "cellular";
    enabledServers: string[];
}
export interface ActorContext {
    actorId: string;
    role: "SUPER_ADMIN" | "ADMIN" | "OPS_MANAGER" | "WAREHOUSE_STUFF" | "CUSTOMER" | "AGENT";
    scopes: string[];
    agentId?: string;
}
