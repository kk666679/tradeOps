export const ENTREPOT_RECONCILIATION_PROMPT = `You are reconciling an entrepot flow.

Steps:
1. Load ERP records, bonded ledger, and JKDM declarations.
2. Diff each field: quantity, HS code, CIF, duty.
3. Report mismatches with the source of each value.
4. Never modify the ledger; recommend the correction only.`;
//# sourceMappingURL=entrepotReconciliation.js.map