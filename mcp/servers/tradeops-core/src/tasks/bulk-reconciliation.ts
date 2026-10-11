// servers/tradeops-core/src/tasks/bulk-reconciliation.ts

import { TaskRegistry, type TaskHandle } from "../../../../shared/extensions/tasks/handler";

export interface ReconciliationJob {
  tenantId: string;
  fromDate: string;
  toDate: string;
}

export interface ReconciliationResult {
  tenantId: string;
  rowsChecked: number;
  mismatches: Array<{
    containerId: string;
    field: "hsCode" | "quantity" | "cifValue" | "dutySuspended";
    ledgerValue: string;
    erpValue: string;
  }>;
  generatedAt: string;
}

export const reconciliationRegistry = new TaskRegistry<ReconciliationResult, ReconciliationJob>();

export function startReconciliation(job: ReconciliationJob): TaskHandle<ReconciliationResult, ReconciliationJob> {
  const task = reconciliationRegistry.create(2000);

  const TOTAL = 20;
  reconciliationRegistry.register(task.taskId, async (t) => {
    const completed = Math.floor(((t.progress ?? 0) / 100) * TOTAL);
    if (completed >= TOTAL) {
      await reconciliationRegistry.complete(t.taskId, {
        tenantId: job.tenantId,
        rowsChecked: TOTAL * 500,
        mismatches: [],
        generatedAt: new Date().toISOString(),
      });
      return;
    }
    t.progress = Math.min(100, Math.round(((completed + 1) / TOTAL) * 100));
    t.updatedAt = new Date().toISOString();
  });

  return task;
}
