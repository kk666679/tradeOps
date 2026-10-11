export declare const LEDGER_RESOURCE_URI = "tradeops://ledger/{tenantId}";
export declare function ledgerSummary(tenantId: string): {
    entries: number;
    dutySuspendedMYR: number;
};
