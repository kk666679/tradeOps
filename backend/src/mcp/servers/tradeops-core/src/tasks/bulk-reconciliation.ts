import type { PrismaService } from "../../../../../prisma/prisma.service";
import { roundCurrency } from "../database";
import { TaskRegistry, type TaskHandle } from "../../../../shared/extensions/tasks/handler";
import type { ReconcileInput } from "../tools/ledger";

export interface ReconciliationJob extends ReconcileInput {}

export interface ReconciliationResult {
  tenantId: string;
  rowsChecked: number;
  truncated: boolean;
  mismatches: Array<{
    ledgerEntryId: string;
    field: "balance";
    expected: string;
    observed: string;
  }>;
  generatedAt: string;
}

interface TaskOwner {
  tenantId: string;
  actorId: string;
}

const MAX_RECONCILIATION_ROWS = 5000;
export const reconciliationRegistry = new TaskRegistry<ReconciliationResult, unknown>();
const taskOwners = new Map<string, TaskOwner>();

function reconciliationDate(value: string, endOfDay: boolean): Date {
  const date = new Date(value);
  if (endOfDay && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    date.setUTCHours(23, 59, 59, 999);
  }
  return date;
}

export function startReconciliation(
  job: ReconciliationJob,
  prisma: PrismaService,
  owner: TaskOwner,
): TaskHandle<ReconciliationResult, unknown> {
  const task = reconciliationRegistry.create(2000);
  taskOwners.set(task.taskId, owner);
  reconciliationRegistry.register(task.taskId, async (current) => {
    const entries = await prisma.bondedLedger.findMany({
      where: {
        tenantId: job.tenantId,
        at: {
          gte: reconciliationDate(job.fromDate, false),
          lte: reconciliationDate(job.toDate, true),
        },
      },
      orderBy: [{ zoneId: "asc" }, { hsCode: "asc" }, { at: "asc" }, { id: "asc" }],
      take: MAX_RECONCILIATION_ROWS + 1,
      select: {
        id: true,
        zoneId: true,
        hsCode: true,
        kind: true,
        value: true,
        prevBalance: true,
        newBalance: true,
      },
    });
    const truncated = entries.length > MAX_RECONCILIATION_ROWS;
    const checked = entries.slice(0, MAX_RECONCILIATION_ROWS);
    const mismatches: ReconciliationResult["mismatches"] = [];
    const previousByLedger = new Map<string, number>();

    for (const entry of checked) {
      const key = `${entry.zoneId}\u0000${entry.hsCode ?? ""}`;
      if (entry.prevBalance === null || entry.newBalance === null) {
        mismatches.push({
          ledgerEntryId: entry.id,
          field: "balance",
          expected: "persisted previous and new balances",
          observed: "balance fields are missing",
        });
        previousByLedger.delete(key);
        continue;
      }

      const expectedBalance = roundCurrency(
        entry.prevBalance + (entry.kind === "ENTRY" ? entry.value : -entry.value),
      );
      if (Math.abs(expectedBalance - entry.newBalance) > 0.01) {
        mismatches.push({
          ledgerEntryId: entry.id,
          field: "balance",
          expected: String(expectedBalance),
          observed: String(entry.newBalance),
        });
      }
      const previousBalance = previousByLedger.get(key);
      if (previousBalance !== undefined && Math.abs(previousBalance - entry.prevBalance) > 0.01) {
        mismatches.push({
          ledgerEntryId: entry.id,
          field: "balance",
          expected: String(previousBalance),
          observed: String(entry.prevBalance),
        });
      }
      previousByLedger.set(key, entry.newBalance);
    }

    await reconciliationRegistry.complete(current.taskId, {
      tenantId: job.tenantId,
      rowsChecked: checked.length,
      truncated,
      mismatches,
      generatedAt: new Date().toISOString(),
    });
  });
  return task;
}

export function assertTaskOwner(taskId: string, tenantId: string, actorId: string): void {
  const task = reconciliationRegistry.get(taskId);
  const owner = taskOwners.get(taskId);
  if (!task || !owner) {
    throw new Error(`unknown task ${taskId}`);
  }
  if (owner.tenantId !== tenantId || owner.actorId !== actorId) {
    throw new Error("task belongs to a different authenticated principal");
  }
}
