// backend/mcp/servers/tradeops/src/resources/inventory.ts

export const INVENTORY_RESOURCE_URI = "tradeops://inventory/{tenantId}";

export function inventorySummary(tenantId: string): { total: number; byZone: Record<string, number> } {
  return { total: 0, byZone: { CFS: 0, FIZ: 0, FCZ: 0 } };
}
