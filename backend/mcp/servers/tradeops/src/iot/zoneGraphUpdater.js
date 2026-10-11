const edges = new Map();
export function applyZoneEdge(tenantId, edge) {
    const list = edges.get(tenantId) ?? [];
    list.push(edge);
    edges.set(tenantId, list);
}
export function getZoneGraph(tenantId) {
    return { edges: edges.get(tenantId) ?? [] };
}
//# sourceMappingURL=zoneGraphUpdater.js.map