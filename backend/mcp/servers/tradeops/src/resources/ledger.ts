// backend/mcp/servers/tradeops/src/resources/ledger.ts

export const LEDGER_RESOURCE_URI = "tradeops://ledger/{tenantId}";

export function ledgerSummary(tenantId: string): { entries: number; dutySuspendedMYR: number } {
  return { entries: 0, dutySuspendedMYR: 0 };
}
