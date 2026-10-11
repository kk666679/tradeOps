import type { AgentDefinition } from "../types"

/**
 * Agent directory — all 19 agents from the reference implementation.
 * `events` lists the ledger events each primary agent owns; cross-cutting
 * agents observe every event instead of owning one.
 *
 * The Custom Agents module provides the 7-agent mesh (registry, builder,
 * orchestration, supervision, policy, monitoring, audit, memory, evals).
 * The domain agents below are instantiated within that mesh.
 */
export const AGENTS: readonly AgentDefinition[] = [
  {
    id: "orchestrator",
    name: "Orchestrator Agent",
    role: "State machine · SLA · retries",
    events: [],
  },
  {
    id: "ledger",
    name: "Ledger Agent",
    role: "Append-only hash chain",
    events: [],
  },
  {
    id: "customs",
    name: "Customs Agent",
    role: "Declarations · HS · permits",
    events: [],
  },
  {
    id: "inventory",
    name: "Inventory Agent",
    role: "Stock · lot / serial · location",
    events: [],
  },
  {
    id: "inbound",
    name: "Inbound Agent",
    role: "Raw material intake",
    events: ["fiz.raw.received"],
  },
  {
    id: "machinery",
    name: "Machinery Agent",
    role: "HS 84 / 85 · asset approval",
    events: ["fiz.machinery.approved"],
  },
  {
    id: "bomyield",
    name: "BOM / Yield Agent",
    role: "Consumption · variance",
    events: ["fiz.production.consumed"],
  },
  {
    id: "waste",
    name: "Waste Agent",
    role: "Reason codes · excise",
    events: ["fiz.scrap.excised"],
  },
  {
    id: "production",
    name: "Production Agent",
    role: "Output · cost roll-up",
    events: ["fiz.fg.produced"],
  },
  {
    id: "export",
    name: "Export Agent",
    role: "Exit confirmation",
    events: ["fiz.export.confirmed"],
  },
  {
    id: "receiving",
    name: "FCZ Receiving Agent",
    role: "ASN · QC · putaway",
    events: ["fcz.inbound.received"],
  },
  {
    id: "transhipment",
    name: "Transhipment Agent",
    role: "Bonded port moves",
    events: ["fcz.transhipment.completed"],
  },
  {
    id: "breakbulk",
    name: "Break-bulk Agent",
    role: "Parent / child split",
    events: ["fcz.breakbulk.split"],
  },
  {
    id: "repack",
    name: "Repackaging Agent",
    role: "Kitting · labelling",
    events: ["fcz.repack.value_added"],
  },
  {
    id: "reexport",
    name: "Re-export Agent",
    role: "Zero-duty exit",
    events: ["fcz.reexport.confirmed"],
  },
  {
    id: "entrepot",
    name: "Entrepot Agent",
    role: "Import ↔ export match",
    events: ["fcz.entrepot.matched"],
  },
  {
    id: "recon",
    name: "Reconciliation Agent",
    role: "Duty suspension close",
    events: ["ledger.duty.reconciled"],
  },
  {
    id: "auditor",
    name: "Auditor Agent",
    role: "Evidence · audit trail",
    events: ["audit.period.closed"],
  },
  {
    id: "risk",
    name: "Risk / Compliance",
    role: "Anomalies · holds · alerts",
    events: [],
  },
]

/** Step id → agent id links used for the animated "Agent links" overlay. */
export const STEP_AGENT_LINKS: readonly (readonly [string, string])[] = [
  ["fiz-1", "inbound"],
  ["fiz-2", "machinery"],
  ["fiz-3", "bomyield"],
  ["fiz-4", "waste"],
  ["fiz-5", "production"],
  ["fiz-6", "export"],
  ["fcz-1", "receiving"],
  ["fcz-2", "transhipment"],
  ["fcz-3", "breakbulk"],
  ["fcz-4", "repack"],
  ["fcz-5", "reexport"],
  ["fcz-6", "entrepot"],
  ["close-recon", "recon"],
  ["close-audit", "auditor"],
]

/** Exception edge: step → hold note (Risk / Compliance). */
export const EXCEPTION_EDGES: readonly (readonly [string, string])[] = [
  ["fiz-1", "close-risk"],
  ["fiz-2", "close-risk"],
  ["fiz-3", "close-risk"],
  ["fiz-4", "close-risk"],
  ["fiz-5", "close-risk"],
  ["fiz-6", "close-risk"],
  ["fcz-1", "close-risk"],
  ["fcz-2", "close-risk"],
  ["fcz-3", "close-risk"],
  ["fcz-4", "close-risk"],
  ["fcz-5", "close-risk"],
  ["fcz-6", "close-risk"],
  ["close-recon", "close-risk"],
  ["close-audit", "close-risk"],
]