import { callBackend } from "./client.js";
export async function postLedgerEntry(input) {
    return callBackend({
        path: "/internal/ledger/entries",
        method: "POST",
        tenantId: input.tenantId,
        actorId: "mcp:tradeops",
        body: input,
    });
}
export async function reconcileLedger(tenantId, fromDate, toDate) {
    return callBackend({
        path: `/internal/ledger/reconcile?from=${fromDate}&to=${toDate}`,
        method: "POST",
        tenantId,
        actorId: "mcp:tradeops",
    });
}
//# sourceMappingURL=ledger.js.map