export const INVENTORY_RESOURCE_URI = "tradeops://inventory/{tenantId}";
export function inventorySummary(tenantId) {
    return { total: 0, byZone: { CFS: 0, FIZ: 0, FCZ: 0 } };
}
//# sourceMappingURL=inventory.js.map