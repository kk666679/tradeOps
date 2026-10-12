import type { PrismaClient } from "@prisma/client";

export interface CreateTaskInput {
  tenantId: string;
  shipmentId: string;
  title: string;
  description?: string;
  assigneeRole: "CUSTOMS_BROKER" | "SENIOR_BROKER" | "CLEARANCE_AGENT" | "DOCUMENTATION_SPECIALIST" | "FINANCE_OFFICER" | "COMPLIANCE_REVIEWER";
  dueInHours?: number;
}

export async function handleCreateTask(input: CreateTaskInput, db: PrismaClient) {
  const dueAt = input.dueInHours ? new Date(Date.now() + input.dueInHours * 3600_000) : null;
  const task = await db.brokerageTask.create({
    data: {
      tenantId: input.tenantId,
      shipmentId: input.shipmentId,
      title: input.title,
      description: input.description,
      assigneeRole: input.assigneeRole as never,
      dueAt,
    },
  });
  return { taskId: task.id, dueAt: task.dueAt };
}
