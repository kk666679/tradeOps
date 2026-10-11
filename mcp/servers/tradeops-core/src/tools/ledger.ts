// servers/tradeops-core/src/tools/ledger.ts

import { z } from "zod";
import { complete, type ToolResult } from "../../../../shared/schemas/mrtr";

export const LedgerEntryInput = z.object({
  tenantId: z.string(),
  containerId: z.string(),
  direction: z.enum(["debit", "credit"]),
  hsCode: z.string().regex(/^\d{6,10}$/),
  quantity: z.number().positive(),
  unit: z.string(),
  cifValueMYR: z.number().nonnegative(),
  dutySuspendedMYR: z.number().nonnegative(),
});
export type LedgerEntryInput = z.infer<typeof LedgerEntryInput>;

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

export async function handleLedgerEntry(raw: LedgerEntryInput): Promise<ToolResult<LedgerEntry>> {
  const input = LedgerEntryInput.parse(raw);
  const entry: LedgerEntry = {
    entryId: crypto.randomUUID(),
    ...input,
    postedAt: new Date().toISOString(),
  };
  return complete(entry);
}

export const ReconcileInput = z.object({
  tenantId: z.string(),
  fromDate: z.string(),
  toDate: z.string(),
});
export type ReconcileInput = z.infer<typeof ReconcileInput>;
