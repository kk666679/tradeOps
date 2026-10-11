export interface AuditRecord {
    id: string;
    at: string;
    tenantId: string;
    actorId: string;
    agentId?: string;
    tool: string;
    inputHash: string;
    outputSummary: string;
    prevHash: string;
    hash: string;
}
export declare function recordAudit(input: Omit<AuditRecord, "prevHash" | "hash">): AuditRecord;
export declare function verifyChain(): boolean;
export declare function snapshotChain(): AuditRecord[];
export declare function hashInput(input: unknown): string;
