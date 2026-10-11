import type { Edge, Node } from "@xyflow/react"

/* ============================================================================
   Workflow domain types — shared by the data layer, node components, and the
   explorer UI. Zone accents come from globals.css design tokens (fiz / fcz).
   ========================================================================== */

/** Operational zone a step belongs to. */
export type WorkflowZone = "fiz" | "fcz" | "control"

/** Label shown inside the step node badge. */
export type StepZoneLabel = "FIZ" | "FCZ" | "LEDGER"

/** Badge value: 1–6 for operational steps, R/A for close-out steps. */
export type StepNumber = 1 | 2 | 3 | 4 | 5 | 6 | "R" | "A"

/** Operational status of a workflow step. */
export type StepStatus = "pending" | "in_progress" | "completed" | "exception" | "on_hold"

/** Duty status carried by every bonded step. */
export type DutyStatus = "suspended" | "zero" | "excised" | "n_a"

/** Module overlay a step belongs to (the six-module substrate). */
export type ModuleOverlay =
  | "Trade OPS"
  | "WMS · FIZ"
  | "WMS · FCZ"
  | "Order Management"
  | "Digital Twin"
  | "Custom Agents"

/* ---------------------------------------------------------------------------
   Authoritative domain model (source of truth for nodes, panel, and list view)
   --------------------------------------------------------------------------- */

export interface WorkflowStepDefinition {
  /** Stable node id, e.g. `fiz-3` or `close-recon`. */
  id: string
  zone: WorkflowZone
  /** Sequence number inside its zone; `R`/`A` for close-out. */
  step: StepNumber
  title: string
  /** Compact one-liner shown on the node. */
  sub: string
  /** Longer copy for the detail panel. */
  description: string
  /** Bonded-ledger event identifier — must match the supplied HTML exactly. */
  event: string
  /** Display name of the agent that owns the event. */
  agent: string
  /** Module overlay this step belongs to (six-module substrate). */
  module: ModuleOverlay
  /** Current operational status. */
  status: StepStatus
  /** HS code relevant to this step (optional). */
  hsCode?: string
  /** Duty status carried by this step. */
  dutyStatus: DutyStatus
  /** Supporting agents that observe the event. */
  supportingAgents: string[]
  /** Exception agents invoked when this step fails its guardrails. */
  exceptionAgents: string[]
  /** Optional exception edge target node id (e.g. a hold note). */
  exceptionTarget?: string
}

export interface AgentDefinition {
  id: string
  name: string
  role: string
  /** Event identifiers this agent owns (used by the detail panel + directory). */
  events: string[]
}

/** Footnote nodes: the bonded-transfer bridge, ledger, and exception hold. */
export interface WorkflowNoteDefinition {
  id: string
  zone: WorkflowZone
  title: string
  sub: string
  description: string
  event: string
}

/** What the detail panel is currently showing. */
export type DetailTarget =
  | { kind: "step"; definition: WorkflowStepDefinition }
  | { kind: "note"; note: WorkflowNoteDefinition }

/* ---------------------------------------------------------------------------
   Node data contracts
   --------------------------------------------------------------------------- */

export interface StepNodeData {
  kind: "step"
  step: StepNumber
  zoneLabel: StepZoneLabel
  zone: WorkflowZone
  title: string
  sub: string
  description: string
  event: string
  agent: string
  module: ModuleOverlay
  status: StepStatus
  hsCode?: string
  dutyStatus: DutyStatus
  supportingAgents: string[]
  exceptionAgents: string[]
  exceptionTarget?: string
  /** True when the step is excluded by the current search query. */
  dimmed?: boolean
  /** True when the step is the selected step or lies downstream of it. */
  onPath?: boolean
  /** Node ids that feed this step (main flow only). */
  upstream: string[]
  /** Node ids this step feeds (main flow only). */
  downstream: string[]
  [key: string]: unknown
}

export interface LaneNodeData {
  kind: "lane"
  title: string
  subtitle: string
  [key: string]: unknown
}

export interface NoteNodeData {
  kind: "note"
  title: string
  sub: string
  event?: string
  dimmed?: boolean
  onPath?: boolean
  [key: string]: unknown
}

export interface AgentNodeData {
  kind: "agent"
  name: string
  role: string
  /** Event identifiers this agent owns, shown in the directory view. */
  events: string[]
  dimmed?: boolean
  [key: string]: unknown
}

/* ---------------------------------------------------------------------------
   Concrete xyflow node / edge unions
   --------------------------------------------------------------------------- */

export type StepFlowNode = Node<StepNodeData, "step">
export type LaneFlowNode = Node<LaneNodeData, "lane">
export type NoteFlowNode = Node<NoteNodeData, "note">
export type AgentFlowNode = Node<AgentNodeData, "agent">

export type WorkflowNode = StepFlowNode | LaneFlowNode | NoteFlowNode | AgentFlowNode
export type WorkflowEdge = Edge

/* ---------------------------------------------------------------------------
   UI helpers
   --------------------------------------------------------------------------- */

/** Everything the detail panel needs for one selected step. */
export interface StepDetail {
  id: string
  zone: WorkflowZone
  zoneLabel: StepZoneLabel
  step: StepNumber
  title: string
  sub: string
  description: string
  event: string
  agent: string
  upstream: WorkflowStepDefinition[]
  downstream: WorkflowStepDefinition[]
}

/** Sequence used by the detail panel's "next step" navigation. */
export const MAIN_FLOW_ORDER: readonly string[] = [
  "fiz-1",
  "fiz-2",
  "fiz-3",
  "fiz-4",
  "fiz-5",
  "fiz-6",
  "zone-transfer",
  "fcz-1",
  "fcz-2",
  "fcz-3",
  "fcz-4",
  "fcz-5",
  "fcz-6",
  "close-recon",
  "close-audit",
]

export const ZONE_LABELS: Record<WorkflowZone, string> = {
  fiz: "Free Industrial Zone",
  fcz: "Free Commercial Zone",
  control: "Control & close-out",
}
