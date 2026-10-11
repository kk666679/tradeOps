export interface ApprovalToken {
    id: string;
    actorId: string;
    action: string;
    approvedAt: string;
    expiresAt: string;
    signerRole: "broker" | "senior_broker" | "compliance" | "principal";
}
export declare function requiredApprovalFor(tool: string): ApprovalToken["signerRole"] | null;
export declare function assertApproval(tool: string, tokens: ApprovalToken[]): void;
