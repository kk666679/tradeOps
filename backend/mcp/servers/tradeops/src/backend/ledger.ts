// backend/mcp/servers/tradeops/src/backend/ledger.ts

import { callBackend } from "./client.js";

export interface LedgerEntry {
  entryId: string;
  tenantId: string;
  containerId: string;
  direction: "debit" | "credit";
  hsCode: string;
  quantity: number;
  unit: string;
  cifValueMYR: number;
  dutySuspendedMYR: number;
  postedAt: string;
}

export async function postLedgerEntry(
  input: Omit<LedgerEntry, "entryId" | "postedAt">,
): Promise<LedgerEntry> {
  return callBackend<LedgerEntry>({
    path: "/internal/ledger/entries",
    method: "POST",
    tenantId: input.tenantId,
    actorId: "mcp:tradeops",
    body: input,
  });
}

export async function reconcileLedger(
  tenantId: string, fromDate: string, toDate: string,
): Promise<{ rowsChecked: number; mismatches: unknown[] }> {
  return callBackend({
    path: `/internal/ledger/reconcile?from=${fromDate}&to=${toDate}`,
    method: "POST",
    tenantId,
    actorId: "mcp:tradeops",
  });
}
