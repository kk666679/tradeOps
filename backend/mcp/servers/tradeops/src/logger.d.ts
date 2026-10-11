type Level = "debug" | "info" | "warn" | "error";
export interface LogFields {
    tenantId?: string;
    actorId?: string;
    agentId?: string;
    tool?: string;
    traceId?: string;
    [key: string]: unknown;
}
export declare const logger: {
    log(level: Level, message: string, fields?: LogFields): void;
    debug: (m: string, f?: LogFields) => void;
    info: (m: string, f?: LogFields) => void;
    warn: (m: string, f?: LogFields) => void;
    error: (m: string, f?: LogFields) => void;
};
export {};
