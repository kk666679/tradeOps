export declare const INVENTORY_RESOURCE_URI = "tradeops://inventory/{tenantId}";
export declare function inventorySummary(tenantId: string): {
    total: number;
    byZone: Record<string, number>;
};
