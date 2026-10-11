export interface ZoneEdge {
    from: string;
    to: string;
    kind: "in" | "out" | "move";
}
export declare function applyZoneEdge(tenantId: string, edge: ZoneEdge): void;
export declare function getZoneGraph(tenantId: string): {
    edges: ZoneEdge[];
};
