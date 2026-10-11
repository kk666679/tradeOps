// backend/mcp/servers/tradeops/src/iot/zoneGraphUpdater.ts

export interface ZoneEdge { from: string; to: string; kind: "in" | "out" | "move"; }

const edges = new Map<string, ZoneEdge[]>();

export function applyZoneEdge(tenantId: string, edge: ZoneEdge): void {
  const list = edges.get(tenantId) ?? [];
  list.push(edge);
  edges.set(tenantId, list);
}

export function getZoneGraph(tenantId: string): { edges: ZoneEdge[] } {
  return { edges: edges.get(tenantId) ?? [] };
}
