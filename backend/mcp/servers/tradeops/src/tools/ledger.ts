// backend/mcp/servers/tradeops/src/tools/ledger.ts

import { z } from "zod";
import { ledgerSummary } from "../resources/ledger";

export const LedgerEntryInput = z.object({
  tenantId: z.string(),
  containerId: z.string(),
  direction: z.enum(["debit", "credit"]),
  hsCode: z.string().regex(/^\d{6,10}$/),
  quantity: z.number().positive(),
  unit: z.string(),
  cifValueMYR: z.number().nonnegative(),
  dutySuspendedMYR: z.number().nonnegative(),
  _meta: z.record(z.unknown()).optional(),
});
export type LedgerEntryInput = z.infer<typeof LedgerEntryInput>;

export async function handleLedgerEntry(raw: LedgerEntryInput) {
  const input = LedgerEntryInput.parse(raw);
  return {
    content: [{
      type: "text",
      text: JSON.stringify({
        entryId: crypto.randomUUID(),
        ...input,
        postedAt: new Date().toISOString(),
      }),
    }],
  };
}

export const LedgerSummaryInput = z.object({
  tenantId: z.string(),
  _meta: z.record(z.unknown()).optional(),
});
export type LedgerSummaryInput = z.infer<typeof LedgerSummaryInput>;

export async function handleLedgerSummary(raw: LedgerSummaryInput) {
  const input = LedgerSummaryInput.parse(raw);
  return { content: [{ type: "text", text: JSON.stringify(ledgerSummary(input.tenantId)) }] };
}
