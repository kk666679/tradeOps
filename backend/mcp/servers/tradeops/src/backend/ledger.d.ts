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
export declare function postLedgerEntry(input: Omit<LedgerEntry, "entryId" | "postedAt">): Promise<LedgerEntry>;
export declare function reconcileLedger(tenantId: string, fromDate: string, toDate: string): Promise<{
    rowsChecked: number;
    mismatches: unknown[];
}>;
