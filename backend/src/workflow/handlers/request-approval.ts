import type { PrismaClient } from "@prisma/client";

export interface RequestApprovalInput {
  tenantId: string;
  declarationId: string;
  actorId: string;
  requiredRole: "CUSTOMS_BROKER" | "SENIOR_BROKER" | "BROKERAGE_MANAGER" | "COMPLIANCE_REVIEWER" | "FINANCE_OFFICER" | "ADMIN";
  reason: string;
  executionRef?: string;
}

export async function handleRequestApproval(input: RequestApprovalInput, db: PrismaClient) {
  const req = await db.approvalRequest.create({
    data: {
      tenantId: input.tenantId,
      declarationId: input.declarationId,
      requestedBy: input.actorId,
      requiredRole: input.requiredRole as never,
      reason: input.reason,
      executionRef: input.executionRef,
    },
  });
  return { approvalRequestId: req.id, status: "pending", requiredRole: input.requiredRole };
}
