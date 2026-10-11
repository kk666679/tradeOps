// backend/mcp/servers/tradeops/src/backend/modules.ts
// Feature module registry. Each module contributes tools and resources.

export interface Module {
  id: string;
  tools: string[];
  resources: string[];
}

export const MODULES: Module[] = [
  { id: "gate",       tools: ["gate.in", "gate.out"], resources: ["yard"] },
  { id: "inventory",  tools: ["inventory.allocate", "inventory.query"], resources: [] },
  { id: "ledger",     tools: ["ledger.entry", "ledger.reconcile"], resources: [] },
  { id: "customs",    tools: ["classify.hs", "duty.calculate", "declaration.prepare", "declaration.submit", "permit.check", "drawback.claim"], resources: ["tariff", "fta-rates"] },
  { id: "compliance", tools: ["gate.evaluate", "gate.explain", "audit.evidence"], resources: ["gate-result", "rule-set"] },
  { id: "iot",        tools: ["device.status", "device.read", "zone.graph"], resources: ["zone-graph"] },
  { id: "audit",      tools: ["audit.verify", "licence.check", "delegation.limits"], resources: ["audit-log"] },
  { id: "ai",         tools: ["rag.search", "forecast.predict", "anomaly.detect"], resources: ["embeddings"] },
];

export function moduleFor(tool: string): Module | undefined {
  return MODULES.find((m) => m.tools.includes(tool));
}
