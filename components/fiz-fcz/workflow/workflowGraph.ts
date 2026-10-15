import { MarkerType, type Edge } from "@xyflow/react"

import { AGENTS, EXCEPTION_EDGES, STEP_AGENT_LINKS } from "./data/agents"
import { CLOSE_OUT_STEPS, CONTROL_NOTES, ZONE_TRANSFER_NOTE } from "./data/closeOut"
import { FCZ_STEPS } from "./data/fczSteps"
import { FIZ_STEPS } from "./data/fizSteps"
import type {
  AgentFlowNode,
  LaneFlowNode,
  NoteFlowNode,
  StepFlowNode,
  WorkflowEdge,
  WorkflowNode,
  WorkflowNoteDefinition,
  WorkflowStepDefinition,
} from "./types"

/* ============================================================================
   Layout constants — preserved from the reference implementation
   ========================================================================== */

export const LAYOUT = {
  lane: {
    fiz: { width: 380, height: 1000 },
    fcz: { width: 380, height: 1000 },
    control: { width: 360, height: 1000 },
  },
  step: { width: 320, height: 122, x: 30, y0: 70, dy: 145 },
  agent: { width: 210, height: 56, x0: 30, dx: 225, y0: 70, dy: 74 },
  agentsLane: { x: 0, y: 1060, width: 1400, height: 400 },
  transfer: { x: 395, y: 795, width: 190, height: 122 },
  control: {
    recon: { x: 20, y: 70 },
    audit: { x: 20, y: 250 },
    ledger: { x: 20, y: 450 },
    risk: { x: 20, y: 610 },
  },
} as const

/* Shared marker definitions — declared exactly once. */
const MARKER = {
  type: MarkerType.ArrowClosed,
  width: 14,
  height: 14,
  color: "#94a3b8",
} as const

const EXCEPTION_MARKER = {
  type: MarkerType.ArrowClosed,
  width: 12,
  height: 12,
  color: "var(--color-alert-500, #e11d48)",
} as const

function requireArrayItem<T>(items: readonly T[], index: number, source: string): T {
  const item = items[index]
  if (item === undefined) {
    throw new Error(`Expected ${source} to contain an item at index ${index}`)
  }
  return item
}

const CLOSE_LEDGER_NOTE = requireArrayItem(CONTROL_NOTES, 0, "control notes")
const CLOSE_RISK_NOTE = requireArrayItem(CONTROL_NOTES, 1, "control notes")
const CLOSE_RECON_STEP = requireArrayItem(CLOSE_OUT_STEPS, 0, "close-out steps")
const CLOSE_AUDIT_STEP = requireArrayItem(CLOSE_OUT_STEPS, 1, "close-out steps")

/* ============================================================================
   Domain registry — single source of truth for steps and footnotes
   ========================================================================== */

const NOTE_DEFINITIONS: readonly WorkflowNoteDefinition[] = [
  {
    ...ZONE_TRANSFER_NOTE,
    zone: "control",
    description:
      "The bridge between the two zones. A bonded transfer keeps duty suspended while goods move from industrial production into the commercial zone.",
  },
  {
    id: "close-ledger",
    zone: "control",
    title: CLOSE_LEDGER_NOTE.title,
    sub: CLOSE_LEDGER_NOTE.sub,
    description:
      "Every step in the workflow appends one event to the bonded ledger. Events are hash-chained, so the sequence can be verified after the fact.",
    event: CLOSE_LEDGER_NOTE.event,
  },
  {
    id: "close-risk",
    zone: "control",
    title: CLOSE_RISK_NOTE.title,
    sub: CLOSE_RISK_NOTE.sub,
    description:
      "When an agent detects an anomaly it raises a hold. Exceptions and SLA breaches are escalated with the evidence already attached.",
    event: CLOSE_RISK_NOTE.event,
  },
]

/* ============================================================================
   Additional overlay nodes (ledger, hold, module, persona, digital twin)
   ========================================================================== */

export const LEDGER_NODES: readonly {
  id: string
  type: "note"
  title: string
  sub: string
  event: string
  zone: "fiz" | "fcz" | "control"
  position: { x: number; y: number }
}[] = [
  {
    id: "ledger-fiz",
    type: "note",
    title: "FIZ Ledger",
    sub: "Append-only hash chain · FIZ events",
    event: "ledger.fiz.append",
    zone: "fiz",
    position: { x: -350, y: 500 },
  },
  {
    id: "ledger-fcz",
    type: "note",
    title: "FCZ Ledger",
    sub: "Append-only hash chain · FCZ events",
    event: "ledger.fcz.append",
    zone: "fcz",
    position: { x: 1030, y: 500 },
  },
  {
    id: "ledger-cross",
    type: "note",
    title: "Cross-Zone Ledger",
    sub: "Unified reconciliation ledger",
    event: "ledger.cross.append",
    zone: "control",
    position: { x: 1400, y: 300 },
  },
]

export const HOLD_NODE: {
  id: string
  type: "note"
  title: string
  sub: string
  event: string
  zone: "control"
  position: { x: number; y: number }
} = {
  id: "hold",
  type: "note",
  title: "Hold / Exception",
  sub: "Risk hold · SLA breach · escalation",
  event: "risk.hold.placed",
  zone: "control",
  position: { x: 1400, y: 550 },
}

export const MODULE_NODES: readonly {
  id: string
  type: "note"
  title: string
  sub: string
  event: string
  position: { x: number; y: number }
}[] = [
  { id: "mod-fiz", type: "note", title: "WMS · FIZ", sub: "Manufacturing WMS module", event: "mod.fiz", position: { x: -250, y: -80 } },
  { id: "mod-fcz", type: "note", title: "WMS · FCZ", sub: "Trading WMS module", event: "mod.fcz", position: { x: 650, y: -80 } },
  { id: "mod-tradeops", type: "note", title: "Trade OPS", sub: "Declarations · HS · duty", event: "mod.tradeops", position: { x: 1050, y: -80 } },
  { id: "mod-orders", type: "note", title: "Order Management", sub: "Purchase · mfg · trading", event: "mod.orders", position: { x: 1050, y: -140 } },
  { id: "mod-twin", type: "note", title: "Digital Twin", sub: "Zone graph · what-if · Pareto", event: "mod.twin", position: { x: 1400, y: -140 } },
  { id: "mod-agents", type: "note", title: "Custom Agents", sub: "Registry · builder · mesh", event: "mod.agents", position: { x: 1400, y: -80 } },
]

export const PERSONA_NODES: readonly {
  id: string
  type: "note"
  title: string
  sub: string
  event: string
  position: { x: number; y: number }
}[] = [
  { id: "persona-fiz-ops", type: "note", title: "FIZ Operator", sub: "Manufacturing zone operator", event: "persona.fiz-ops", position: { x: -250, y: 1150 } },
  { id: "persona-fcz-ops", type: "note", title: "FCZ Operator", sub: "Commercial zone operator", event: "persona.fcz-ops", position: { x: 650, y: 1150 } },
  { id: "persona-brokers", type: "note", title: "Customs Brokers", sub: "Declarations · permits · clearance", event: "persona.brokers", position: { x: 1050, y: 1150 } },
  { id: "persona-cfs", type: "note", title: "CFS / 3PL", sub: "Consolidation · transhipment", event: "persona.cfs", position: { x: 650, y: 1220 } },
  { id: "persona-ff", type: "note", title: "Freight Forwarders", sub: "Port · transport · docs", event: "persona.ff", position: { x: 1050, y: 1220 } },
]

export const TWIN_NODES: readonly {
  id: string
  type: "note"
  title: string
  sub: string
  event: string
  position: { x: number; y: number }
}[] = [
  { id: "twin-zone-graph", type: "note", title: "Zone Graph", sub: "Topology · capacity · flows", event: "twin.zone-graph", position: { x: 1600, y: 100 } },
  { id: "twin-pareto", type: "note", title: "Bottleneck Pareto", sub: "Dwell · gate · process", event: "twin.pareto", position: { x: 1600, y: 180 } },
  { id: "twin-whatif", type: "note", title: "What-If Simulator", sub: "Scenario · compare · decide", event: "twin.whatif", position: { x: 1600, y: 260 } },
]

/** All selectable steps in execution order. */
export const WORKFLOW_STEPS: readonly WorkflowStepDefinition[] = [
  ...FIZ_STEPS,
  ...FCZ_STEPS,
  ...CLOSE_OUT_STEPS,
]

export const STEP_BY_ID: ReadonlyMap<string, WorkflowStepDefinition> = new Map(
  WORKFLOW_STEPS.map((step) => [step.id, step]),
)

export const NOTE_BY_ID: ReadonlyMap<string, WorkflowNoteDefinition> = new Map(
  NOTE_DEFINITIONS.map((note) => [note.id, note]),
)

export const AGENT_BY_NAME: ReadonlyMap<string, (typeof AGENTS)[number]> = new Map(
  AGENTS.map((agent) => [agent.name, agent]),
)

/** Node id → primary agent id, derived from the preserved step→agent map. */
export const STEP_AGENT_BY_NODE: ReadonlyMap<string, string> = new Map(
  STEP_AGENT_LINKS.map(([nodeId, agentId]) => [nodeId, agentId]),
)

/** Main-flow adjacency: node id → node ids it feeds. */
const SUCCESSORS: ReadonlyMap<string, readonly string[]> = new Map<string, string[]>([
  ["fiz-1", ["fiz-2"]],
  ["fiz-2", ["fiz-3"]],
  ["fiz-3", ["fiz-4"]],
  ["fiz-4", ["fiz-5"]],
  ["fiz-5", ["fiz-6"]],
  ["fiz-6", ["zone-transfer"]],
  ["zone-transfer", ["fcz-1"]],
  ["fcz-1", ["fcz-2"]],
  ["fcz-2", ["fcz-3"]],
  ["fcz-3", ["fcz-4"]],
  ["fcz-4", ["fcz-5"]],
  ["fcz-5", ["fcz-6"]],
  ["fcz-6", ["close-recon"]],
  ["close-recon", ["close-audit"]],
  ["close-audit", ["close-ledger"]],
])

const PREDECESSORS: ReadonlyMap<string, readonly string[]> = (() => {
  const map = new Map<string, string[]>()
  for (const [from, targets] of SUCCESSORS) {
    for (const to of targets) {
      const list = map.get(to) ?? []
      list.push(from)
      map.set(to, list)
    }
  }
  return map
})()

/** Every node reachable downstream of `nodeId` (inclusive). */
export function downstreamOf(nodeId: string): Set<string> {
  const seen = new Set<string>()
  const stack = [nodeId]
  while (stack.length > 0) {
    const current = stack.pop()
    if (current === undefined || seen.has(current)) continue
    seen.add(current)
    for (const next of SUCCESSORS.get(current) ?? []) stack.push(next)
  }
  return seen
}

/** Every node that feeds `nodeId` (inclusive). */
export function upstreamOf(nodeId: string): Set<string> {
  const seen = new Set<string>()
  const stack = [nodeId]
  while (stack.length > 0) {
    const current = stack.pop()
    if (current === undefined || seen.has(current)) continue
    seen.add(current)
    for (const prev of PREDECESSORS.get(current) ?? []) stack.push(prev)
  }
  return seen
}

export function downstreamIdsOf(nodeId: string): string[] {
  return [...(SUCCESSORS.get(nodeId) ?? [])]
}

export function upstreamIdsOf(nodeId: string): string[] {
  return [...(PREDECESSORS.get(nodeId) ?? [])]
}

/** Resolves a node id to either a step definition or a note definition. */
export function resolveWorkflowItem(nodeId: string):
  | { kind: "step"; definition: WorkflowStepDefinition }
  | { kind: "note"; note: WorkflowNoteDefinition }
  | undefined {
  const step = STEP_BY_ID.get(nodeId)
  if (step) return { kind: "step", definition: step }
  const note = NOTE_BY_ID.get(nodeId)
  if (note) return { kind: "note", note }
  return undefined
}

/** Every node id that participates in search (agents only when included). */
export function searchableNodeIds(includeAgents: boolean): string[] {
  const ids: string[] = [
    ...WORKFLOW_STEPS.map((step) => step.id),
    ...NOTE_DEFINITIONS.map((note) => note.id),
  ]
  if (includeAgents) {
    ids.push(...AGENTS.map((agent) => `ag-${agent.id}`))
  }
  return ids
}

/** Steps in main-flow order (notes excluded). */
export const MAIN_FLOW_STEPS: readonly WorkflowStepDefinition[] = WORKFLOW_STEPS

const MAIN_FLOW_SEQUENCE = [
  ...FIZ_STEPS.map((s) => s.id),
  "zone-transfer",
  ...FCZ_STEPS.map((s) => s.id),
  ...CLOSE_OUT_STEPS.map((s) => s.id),
]

export function nextStepId(nodeId: string): string | undefined {
  const index = MAIN_FLOW_SEQUENCE.indexOf(nodeId)
  if (index < 0 || index === MAIN_FLOW_SEQUENCE.length - 1) return undefined
  return MAIN_FLOW_SEQUENCE[index + 1]
}

export function previousStepId(nodeId: string): string | undefined {
  const index = MAIN_FLOW_SEQUENCE.indexOf(nodeId)
  if (index <= 0) return undefined
  return MAIN_FLOW_SEQUENCE[index - 1]
}

/* ============================================================================
   Node builders
   ========================================================================== */

export interface BuildNodesOptions {
  /** Include the Agents lane and the agent directory grid. */
  includeAgents?: boolean
  /**
   * Include the platform overlay nodes (module, persona, digital twin, ledger,
   * and hold context). The marketing surfaces render the clean bonded workflow
   * without them; the app-scoped explorer keeps them for platform context.
   */
  showOverlays?: boolean
  /** Node ids excluded by the active search — rendered dimmed. */
  dimmedIds?: ReadonlySet<string>
  /** Node ids on the selected path (selected step + downstream). */
  onPathIds?: ReadonlySet<string>
  /** Node id rendered with the selected ring. */
  selectedId?: string | null
}

function stepNode(
  definition: WorkflowStepDefinition,
  options: BuildNodesOptions,
): StepFlowNode {
  const dimmed = options.dimmedIds?.has(definition.id) ?? false
  const onPath = options.onPathIds?.has(definition.id) ?? false
  const selected = options.selectedId === definition.id
  return {
    id: definition.id,
    type: "step",
    selected,
    data: {
      kind: "step",
      step: definition.step,
      zoneLabel:
        definition.zone === "fiz"
          ? "FIZ"
          : definition.zone === "fcz"
            ? "FCZ"
            : "LEDGER",
      zone: definition.zone,
      title: definition.title,
      sub: definition.sub,
      description: definition.description,
      event: definition.event,
      agent: definition.agent,
      module: definition.module,
      status: definition.status,
      hsCode: definition.hsCode,
      dutyStatus: definition.dutyStatus,
      supportingAgents: [...definition.supportingAgents],
      exceptionAgents: [...definition.exceptionAgents],
      exceptionTarget: definition.exceptionTarget,
      dimmed,
      onPath,
      upstream: upstreamIdsOf(definition.id),
      downstream: downstreamIdsOf(definition.id),
    },
  } as StepFlowNode
}

export function buildWorkflowNodes(options: BuildNodesOptions = {}): WorkflowNode[] {
  const includeAgents = options.includeAgents ?? false
  const showOverlays = options.showOverlays ?? true
  const dimmed = options.dimmedIds
  const onPath = options.onPathIds
  const selectedId = options.selectedId ?? null

  const nodes: WorkflowNode[] = []

  /* ---- lanes (parents first) ---- */
  nodes.push({
    id: "lane-fiz",
    type: "lane",
    position: { x: 0, y: 0 },
    style: { width: LAYOUT.lane.fiz.width, height: LAYOUT.lane.fiz.height },
    data: {
      kind: "lane",
      title: "FIZ · Free Industrial Zone",
      subtitle: "manufacturing inputs · duty-suspended",
    },
    className: "zone-fiz",
    draggable: false,
    selectable: false,
    connectable: false,
    deletable: false,
  } satisfies LaneFlowNode)

  nodes.push({
    id: "lane-fcz",
    type: "lane",
    position: { x: 600, y: 0 },
    style: { width: LAYOUT.lane.fcz.width, height: LAYOUT.lane.fcz.height },
    data: {
      kind: "lane",
      title: "FCZ · Free Commercial Zone",
      subtitle: "commercial flows · zero duty",
    },
    className: "zone-fcz",
    draggable: false,
    selectable: false,
    connectable: false,
    deletable: false,
  } satisfies LaneFlowNode)

  nodes.push({
    id: "lane-close",
    type: "lane",
    position: { x: 1040, y: 0 },
    style: { width: LAYOUT.lane.control.width, height: LAYOUT.lane.control.height },
    data: {
      kind: "lane",
      title: "Control & close-out",
      subtitle: "reconciliation · audit",
    },
    className: "zone-core",
    draggable: false,
    selectable: false,
    connectable: false,
    deletable: false,
  } satisfies LaneFlowNode)

  /* Digital Twin lane — part of the platform overlay set */
  if (showOverlays) {
    nodes.push({
      id: "lane-twin",
      type: "lane",
      position: { x: 1400, y: 0 },
      style: { width: 200, height: 500 },
      data: {
        kind: "lane",
        title: "Digital Twin",
        subtitle: "zone graph · what-if · Pareto",
      },
      className: "zone-twin",
      draggable: false,
      selectable: false,
      connectable: false,
      deletable: false,
    } satisfies LaneFlowNode)
  }

  if (includeAgents) {
    nodes.push({
      id: "lane-agents",
      type: "lane",
      position: { x: LAYOUT.agentsLane.x, y: LAYOUT.agentsLane.y },
      style: { width: LAYOUT.agentsLane.width, height: LAYOUT.agentsLane.height },
      data: {
        kind: "lane",
        title: "Agents",
        subtitle: "one primary agent per event · supporting + exception agents",
      },
      className: "zone-agents",
      draggable: false,
      selectable: false,
      connectable: false,
      deletable: false,
    } satisfies LaneFlowNode)
  }

  /* ---- FIZ steps (top → bottom) ---- */
  FIZ_STEPS.forEach((definition, index) => {
    nodes.push({
      ...stepNode(definition, { dimmedIds: dimmed, onPathIds: onPath, selectedId }),
      parentId: "lane-fiz",
      extent: "parent",
      draggable: false,
      deletable: false,
      position: { x: LAYOUT.step.x, y: LAYOUT.step.y0 + index * LAYOUT.step.dy },
      style: { width: LAYOUT.step.width, height: LAYOUT.step.height },
      className: "zone-fiz",
    } satisfies StepFlowNode)
  })

  /* ---- FCZ steps (bottom → top, so the snake connects) ---- */
  FCZ_STEPS.forEach((definition, index) => {
    nodes.push({
      ...stepNode(definition, { dimmedIds: dimmed, onPathIds: onPath, selectedId }),
      parentId: "lane-fcz",
      extent: "parent",
      draggable: false,
      deletable: false,
      position: {
        x: LAYOUT.step.x,
        y: LAYOUT.step.y0 + (FCZ_STEPS.length - 1 - index) * LAYOUT.step.dy,
      },
      style: { width: LAYOUT.step.width, height: LAYOUT.step.height },
      className: "zone-fcz",
    } satisfies StepFlowNode)
  })

  /* ---- bonded transfer bridge (between the two lanes) ---- */
  nodes.push({
    id: "zone-transfer",
    type: "note",
    position: { x: LAYOUT.transfer.x, y: LAYOUT.transfer.y },
    style: { width: LAYOUT.transfer.width, height: LAYOUT.transfer.height },
    className: "zone-core",
    draggable: false,
    selectable: true,
    deletable: false,
    selected: selectedId === "zone-transfer",
    data: {
      kind: "note",
      title: ZONE_TRANSFER_NOTE.title,
      sub: ZONE_TRANSFER_NOTE.sub,
      event: ZONE_TRANSFER_NOTE.event,
      dimmed: dimmed?.has("zone-transfer") ?? false,
      onPath: onPath?.has("zone-transfer") ?? false,
    },
  } satisfies NoteFlowNode)

  /* ---- close-out lane ---- */
  const closeOutWithPosition: readonly (readonly [
    WorkflowStepDefinition,
    { x: number; y: number },
  ])[] = [
    [CLOSE_RECON_STEP, LAYOUT.control.recon],
    [CLOSE_AUDIT_STEP, LAYOUT.control.audit],
  ]

  for (const [definition, position] of closeOutWithPosition) {
    nodes.push({
      ...stepNode(definition, { dimmedIds: dimmed, onPathIds: onPath, selectedId }),
      parentId: "lane-close",
      extent: "parent",
      draggable: false,
      deletable: false,
      position,
      style: { width: LAYOUT.step.width, height: LAYOUT.step.height },
      className: "zone-core",
    } satisfies StepFlowNode)
  }

  const controlNotesWithPosition: readonly (readonly [
    WorkflowNoteDefinition,
    { x: number; y: number; height: number },
  ])[] = [
    [NOTE_BY_ID.get("close-ledger")!, { ...LAYOUT.control.ledger, height: 110 }],
    [NOTE_BY_ID.get("close-risk")!, { ...LAYOUT.control.risk, height: 110 }],
  ]

  for (const [note, position] of controlNotesWithPosition) {
    nodes.push({
      id: note.id,
      type: "note",
      parentId: "lane-close",
      extent: "parent",
      draggable: false,
      selectable: true,
      deletable: false,
      selected: selectedId === note.id,
      position: { x: position.x, y: position.y },
      style: { width: LAYOUT.step.width, height: position.height },
      className: "zone-core",
      data: {
        kind: "note",
        title: note.title,
        sub: note.sub,
        event: note.event,
        dimmed: dimmed?.has(note.id) ?? false,
        onPath: onPath?.has(note.id) ?? false,
      },
    } satisfies NoteFlowNode)
  }

  /* ---- overlay nodes (ledger, hold, module, persona, digital twin) ---- */
  if (showOverlays) {
    const allOverlayNodes = [
      ...LEDGER_NODES,
      HOLD_NODE,
      ...MODULE_NODES,
      ...PERSONA_NODES,
      ...TWIN_NODES,
    ]

    for (const overlay of allOverlayNodes) {
      nodes.push({
        id: overlay.id,
        type: "note",
        draggable: false,
        selectable: true,
        deletable: false,
        selected: selectedId === overlay.id,
        position: overlay.position,
        style: { width: 220, height: 80 },
        className: "zone-core",
        data: {
          kind: "note",
          title: overlay.title,
          sub: overlay.sub,
          event: overlay.event,
          dimmed: dimmed?.has(overlay.id) ?? false,
          onPath: onPath?.has(overlay.id) ?? false,
        },
      } satisfies NoteFlowNode)
    }
  }

  /* ---- agents grid ---- */
  if (includeAgents) {
    AGENTS.forEach((agent, index) => {
      const column = index % 6
      const row = Math.floor(index / 6)
      nodes.push({
        id: `ag-${agent.id}`,
        type: "agent",
        parentId: "lane-agents",
        extent: "parent",
        draggable: false,
        selectable: false,
        deletable: false,
        position: {
          x: LAYOUT.agent.x0 + column * LAYOUT.agent.dx,
          y: LAYOUT.agent.y0 + row * LAYOUT.agent.dy,
        },
        style: { width: LAYOUT.agent.width, height: LAYOUT.agent.height },
        data: {
          kind: "agent",
          name: agent.name,
          role: agent.role,
          events: [...agent.events],
          dimmed: dimmed?.has(`ag-${agent.id}`) ?? false,
        },
      } satisfies AgentFlowNode)
    })
  }

  return nodes
}

/* ============================================================================
   Edge builders — comprehensive workflow edges
   ========================================================================== */

/**
 * The reference bonded-workflow edge set: FIZ chain → bonded transfer → FCZ
 * chain → duty reconciliation → audit close → bonded ledger. These edges only
 * reference nodes that always exist (lanes, steps, and the three control
 * notes), so they are safe for the marketing surfaces where the platform
 * overlay nodes are hidden.
 */
export function buildReferenceEdges(): WorkflowEdge[] {
  const edges: WorkflowEdge[] = []

  /* FIZ chain: 1 → 6 (top-down: source leaves bottom "b", target enters top "t-in") */
  for (let i = 1; i <= 5; i += 1) {
    edges.push({
      id: `e-fiz-${i}`,
      source: `fiz-${i}`,
      target: `fiz-${i + 1}`,
      sourceHandle: "b",
      targetHandle: "t-in",
      type: "smoothstep",
      className: "edge-main",
      markerEnd: MARKER,
    })
  }

  /* FIZ export → bonded transfer → FCZ inbound */
  edges.push({
    id: "e-fiz6-transfer",
    source: "fiz-6",
    target: "zone-transfer",
    sourceHandle: "r",
    targetHandle: "l-in",
    type: "smoothstep",
    className: "edge-main",
    markerEnd: MARKER,
  })
  edges.push({
    id: "e-transfer-fcz1",
    source: "zone-transfer",
    target: "fcz-1",
    sourceHandle: "r",
    targetHandle: "l-in",
    type: "smoothstep",
    className: "edge-main",
    markerEnd: MARKER,
  })

  /* FCZ chain: 1 → 6 (bottom-up: source leaves top "t", target enters bottom "b-in") */
  for (let i = 1; i <= 5; i += 1) {
    edges.push({
      id: `e-fcz-${i}`,
      source: `fcz-${i}`,
      target: `fcz-${i + 1}`,
      sourceHandle: "t",
      targetHandle: "b-in",
      type: "smoothstep",
      className: "edge-main",
      markerEnd: MARKER,
    })
  }

  /* Close-out */
  edges.push({
    id: "e-fcz6-recon",
    source: "fcz-6",
    target: "close-recon",
    sourceHandle: "r",
    targetHandle: "l-in",
    type: "smoothstep",
    className: "edge-main",
    markerEnd: MARKER,
  })
  edges.push({
    id: "e-recon-audit",
    source: "close-recon",
    target: "close-audit",
    sourceHandle: "b",
    targetHandle: "t-in",
    type: "smoothstep",
    className: "edge-main",
    markerEnd: MARKER,
  })
  edges.push({
    id: "e-audit-ledger",
    source: "close-audit",
    target: "close-ledger",
    sourceHandle: "b",
    targetHandle: "t-in",
    type: "smoothstep",
    className: "edge-soft",
    markerEnd: MARKER,
  })

  return edges
}

export function buildBaseEdges(): WorkflowEdge[] {
  const edges: WorkflowEdge[] = []

  /* ============ MAIN FLOW ============ */
  /* FIZ chain: 1 → 6 (top-down) */
  for (let i = 1; i <= 5; i += 1) {
    edges.push({
      id: `e-fiz-${i}-${i + 1}`,
      source: `fiz-${i}`,
      target: `fiz-${i + 1}`,
      sourceHandle: "b",
      targetHandle: "t-in",
      type: "smoothstep",
      animated: true,
      data: { kind: "main" },
      className: "edge-main",
      style: { stroke: "var(--xy-edge-main)", strokeWidth: 2 },
      markerEnd: MARKER,
    })
  }

  /* FIZ export → bonded transfer → FCZ inbound */
  edges.push({
    id: "e-fiz6-fcz1",
    source: "fiz-6",
    target: "fcz-1",
    sourceHandle: "r",
    targetHandle: "l-in",
    type: "smoothstep",
    animated: true,
    data: { kind: "main", label: "FIZ export → FCZ inbound" },
    label: "FIZ export → FCZ inbound",
    className: "edge-main",
    style: { stroke: "var(--xy-edge-main)", strokeWidth: 2 },
    markerEnd: MARKER,
  })

  /* FCZ chain: 1 → 6 (bottom-up) */
  for (let i = 1; i <= 5; i += 1) {
    edges.push({
      id: `e-fcz-${i}-${i + 1}`,
      source: `fcz-${i}`,
      target: `fcz-${i + 1}`,
      sourceHandle: "t",
      targetHandle: "b-in",
      type: "smoothstep",
      animated: true,
      data: { kind: "main" },
      className: "edge-main",
      style: { stroke: "var(--xy-edge-main)", strokeWidth: 2 },
      markerEnd: MARKER,
    })
  }

  /* Close-out */
  edges.push({
    id: "e-fcz6-recon",
    source: "fcz-6",
    target: "close-recon",
    sourceHandle: "r",
    targetHandle: "l-in",
    type: "smoothstep",
    animated: true,
    data: { kind: "main" },
    className: "edge-main",
    style: { stroke: "var(--xy-edge-main)", strokeWidth: 2 },
    markerEnd: MARKER,
  })
  edges.push({
    id: "e-recon-audit",
    source: "close-recon",
    target: "close-audit",
    sourceHandle: "b",
    targetHandle: "t-in",
    type: "smoothstep",
    animated: true,
    data: { kind: "main" },
    className: "edge-main",
    style: { stroke: "var(--xy-edge-main)", strokeWidth: 2 },
    markerEnd: MARKER,
  })

  /* ============ OPTIONAL CROSS-ZONE TRANSFER ============ */
  edges.push({
    id: "e-fiz6-transfer",
    source: "fiz-6",
    target: "zone-transfer",
    sourceHandle: "r",
    targetHandle: "l-in",
    type: "smoothstep",
    data: { kind: "optional", label: "optional bonded transfer" },
    label: "optional bonded transfer",
    className: "edge-optional",
    style: { stroke: "var(--xy-edge-optional)", strokeWidth: 2, strokeDasharray: "6 4" },
  })
  edges.push({
    id: "e-transfer-fcz1",
    source: "zone-transfer",
    target: "fcz-1",
    sourceHandle: "r",
    targetHandle: "l-in",
    type: "smoothstep",
    data: { kind: "optional" },
    className: "edge-optional",
    style: { stroke: "var(--xy-edge-optional)", strokeWidth: 2, strokeDasharray: "6 4" },
  })

  /* ============ EXCEPTION FLOW ============ */
  edges.push({
    id: "e-fiz4-waste",
    source: "fiz-4",
    target: "ag-waste",
    sourceHandle: "r",
    targetHandle: "l-in",
    type: "smoothstep",
    data: { kind: "exception", reason: "scrap not reason-coded or not excised" },
    label: "reason-code / excise",
    className: "edge-exception",
    style: { stroke: "var(--xy-edge-exception)", strokeWidth: 2, strokeDasharray: "4 4" },
    markerEnd: EXCEPTION_MARKER,
  })
  edges.push({
    id: "e-waste-ledger",
    source: "ag-waste",
    target: "ledger-fiz",
    sourceHandle: "b",
    targetHandle: "t-in",
    type: "smoothstep",
    data: { kind: "ledger" },
    className: "edge-ledger",
    style: { stroke: "var(--xy-edge-ledger)", strokeWidth: 2, strokeDasharray: "2 4" },
  })
  edges.push({
    id: "e-fcz3-risk",
    source: "fcz-3",
    target: "ag-risk",
    sourceHandle: "r",
    targetHandle: "l-in",
    type: "smoothstep",
    data: { kind: "exception", reason: "break-bulk quantity mismatch" },
    label: "qty mismatch",
    className: "edge-exception",
    style: { stroke: "var(--xy-edge-exception)", strokeWidth: 2, strokeDasharray: "4 4" },
    markerEnd: EXCEPTION_MARKER,
  })
  edges.push({
    id: "e-risk-hold",
    source: "ag-risk",
    target: "hold",
    sourceHandle: "b",
    targetHandle: "t-in",
    type: "smoothstep",
    data: { kind: "exception", reason: "hold placed" },
    className: "edge-exception",
    style: { stroke: "var(--xy-edge-exception)", strokeWidth: 2 },
    markerEnd: EXCEPTION_MARKER,
  })
  edges.push({
    id: "e-hold-notify",
    source: "hold",
    target: "ag-risk",
    sourceHandle: "r",
    targetHandle: "l-in",
    type: "smoothstep",
    data: { kind: "exception" },
    className: "edge-exception",
    style: { stroke: "var(--xy-edge-exception)", strokeWidth: 2, strokeDasharray: "4 4" },
  })
  edges.push({
    id: "e-fcz6-entrepot",
    source: "fcz-6",
    target: "ag-entrepot",
    sourceHandle: "r",
    targetHandle: "l-in",
    type: "smoothstep",
    data: { kind: "exception", reason: "entrepot import/export mismatch" },
    label: "import ↔ export mismatch",
    className: "edge-exception",
    style: { stroke: "var(--xy-edge-exception)", strokeWidth: 2, strokeDasharray: "4 4" },
    markerEnd: EXCEPTION_MARKER,
  })
  edges.push({
    id: "e-entrepot-recon",
    source: "ag-entrepot",
    target: "close-recon",
    sourceHandle: "b",
    targetHandle: "t-in",
    type: "smoothstep",
    data: { kind: "exception" },
    className: "edge-exception",
    style: { stroke: "var(--xy-edge-exception)", strokeWidth: 2, strokeDasharray: "4 4" },
    markerEnd: EXCEPTION_MARKER,
  })
  edges.push({
    id: "e-audit-risk",
    source: "close-audit",
    target: "ag-risk",
    sourceHandle: "r",
    targetHandle: "l-in",
    type: "smoothstep",
    data: { kind: "exception", reason: "audit evidence missing or hash mismatch" },
    label: "hash mismatch",
    className: "edge-exception",
    style: { stroke: "var(--xy-edge-exception)", strokeWidth: 2, strokeDasharray: "4 4" },
    markerEnd: EXCEPTION_MARKER,
  })

  /* ============ LEDGER EMISSION EDGES ============ */
  /* FIZ ledger emissions */
  for (let i = 1; i <= 6; i += 1) {
    edges.push({
      id: `e-fiz${i}-ledger`,
      source: `fiz-${i}`,
      target: "ledger-fiz",
      sourceHandle: "r",
      targetHandle: "l-in",
      type: "smoothstep",
      data: { kind: "ledger" },
      className: "edge-ledger",
      style: { stroke: "var(--xy-edge-ledger)", strokeWidth: 1.5, strokeDasharray: "2 4" },
    })
  }

  /* FCZ ledger emissions */
  for (let i = 1; i <= 6; i += 1) {
    edges.push({
      id: `e-fcz${i}-ledger`,
      source: `fcz-${i}`,
      target: "ledger-fcz",
      sourceHandle: "r",
      targetHandle: "l-in",
      type: "smoothstep",
      data: { kind: "ledger" },
      className: "edge-ledger",
      style: { stroke: "var(--xy-edge-ledger)", strokeWidth: 1.5, strokeDasharray: "2 4" },
    })
  }

  /* Cross-zone ledger emissions */
  edges.push({
    id: "e-transfer-ledger",
    source: "zone-transfer",
    target: "ledger-cross",
    sourceHandle: "b",
    targetHandle: "t-in",
    type: "smoothstep",
    data: { kind: "ledger" },
    className: "edge-ledger",
    style: { stroke: "var(--xy-edge-ledger)", strokeWidth: 1.5, strokeDasharray: "2 4" },
  })
  edges.push({
    id: "e-recon-ledger",
    source: "close-recon",
    target: "ledger-cross",
    sourceHandle: "b",
    targetHandle: "t-in",
    type: "smoothstep",
    data: { kind: "ledger" },
    className: "edge-ledger",
    style: { stroke: "var(--xy-edge-ledger)", strokeWidth: 1.5, strokeDasharray: "2 4" },
  })
  edges.push({
    id: "e-audit-ledger",
    source: "close-audit",
    target: "ledger-cross",
    sourceHandle: "b",
    targetHandle: "t-in",
    type: "smoothstep",
    data: { kind: "ledger" },
    className: "edge-ledger",
    style: { stroke: "var(--xy-edge-ledger)", strokeWidth: 1.5, strokeDasharray: "2 4" },
  })

  /* ============ AGENT ORCHESTRATION EDGES ============ */
  /* Only agents that exist in the directory — the transfer note has no
     primary agent in the reference implementation. */
  const agentLinks: readonly (readonly [string, string])[] = [
    ["fiz-1", "ag-inbound"],
    ["fiz-2", "ag-machinery"],
    ["fiz-3", "ag-bomyield"],
    ["fiz-4", "ag-waste"],
    ["fiz-5", "ag-production"],
    ["fiz-6", "ag-export"],
    ["fcz-1", "ag-receiving"],
    ["fcz-2", "ag-transhipment"],
    ["fcz-3", "ag-breakbulk"],
    ["fcz-4", "ag-repack"],
    ["fcz-5", "ag-reexport"],
    ["fcz-6", "ag-entrepot"],
    ["close-recon", "ag-recon"],
    ["close-audit", "ag-auditor"],
  ]

  for (const [source, target] of agentLinks) {
    edges.push({
      id: `ea-${source}-${target.replace("ag-", "")}`,
      source,
      target,
      sourceHandle: "b",
      targetHandle: "t-in",
      type: "smoothstep",
      data: { kind: "agent", role: "primary" },
      className: "edge-agent",
      style: { stroke: "var(--xy-edge-agent)", strokeWidth: 1.5 },
      animated: true,
    })
  }

  return edges
}

/** Exception edges: step → hold note (Risk / Compliance) - legacy simple version. */
export function buildExceptionEdges(): WorkflowEdge[] {
  return EXCEPTION_EDGES.map(([source, target]) => ({
    id: `e-exc-${source}`,
    source,
    target,
    sourceHandle: "r",
    targetHandle: "l-in",
    type: "smoothstep",
    className: "edge-exception",
    animated: true,
    zIndex: -1,
    markerEnd: EXCEPTION_MARKER,
  }))
}

export function buildAgentEdges(): WorkflowEdge[] {
  return STEP_AGENT_LINKS.map(([nodeId, agentId]) => ({
    id: `ea-${nodeId}-${agentId}`,
    source: nodeId,
    target: `ag-${agentId}`,
    sourceHandle: "b",
    targetHandle: "t-in",
    type: "smoothstep",
    className: "edge-agent",
    animated: true,
    zIndex: 0,
  }))
}

/** Module overlay edges: module → lane */
export function buildModuleEdges(): WorkflowEdge[] {
  return [
    { id: "e-mod-fiz", source: "mod-fiz", target: "lane-fiz", type: "smoothstep", data: { kind: "module" }, className: "edge-module", style: { stroke: "var(--xy-module)", strokeWidth: 1.5, strokeDasharray: "4 4" } },
    { id: "e-mod-fcz", source: "mod-fcz", target: "lane-fcz", type: "smoothstep", data: { kind: "module" }, className: "edge-module", style: { stroke: "var(--xy-module)", strokeWidth: 1.5, strokeDasharray: "4 4" } },
    { id: "e-mod-tradeops", source: "mod-tradeops", target: "lane-close", type: "smoothstep", data: { kind: "module" }, className: "edge-module", style: { stroke: "var(--xy-module)", strokeWidth: 1.5, strokeDasharray: "4 4" } },
    { id: "e-mod-orders", source: "mod-orders", target: "lane-close", type: "smoothstep", data: { kind: "module" }, className: "edge-module", style: { stroke: "var(--xy-module)", strokeWidth: 1.5, strokeDasharray: "4 4" } },
    { id: "e-mod-twin", source: "mod-twin", target: "lane-twin", type: "smoothstep", data: { kind: "module" }, className: "edge-module", style: { stroke: "var(--xy-module)", strokeWidth: 1.5, strokeDasharray: "4 4" } },
    { id: "e-mod-agents", source: "mod-agents", target: "lane-agents", type: "smoothstep", data: { kind: "module" }, className: "edge-module", style: { stroke: "var(--xy-module)", strokeWidth: 1.5, strokeDasharray: "4 4" } },
  ]
}

/** Persona overlay edges: persona → lane */
export function buildPersonaEdges(): WorkflowEdge[] {
  return [
    { id: "e-persona-fiz", source: "persona-fiz-ops", target: "lane-fiz", type: "smoothstep", data: { kind: "persona" }, className: "edge-persona", style: { stroke: "var(--xy-edge-persona)", strokeWidth: 1.5, strokeDasharray: "4 4" } },
    { id: "e-persona-fcz", source: "persona-fcz-ops", target: "lane-fcz", type: "smoothstep", data: { kind: "persona" }, className: "edge-persona", style: { stroke: "var(--xy-edge-persona)", strokeWidth: 1.5, strokeDasharray: "4 4" } },
    { id: "e-persona-brokers", source: "persona-brokers", target: "lane-close", type: "smoothstep", data: { kind: "persona" }, className: "edge-persona", style: { stroke: "var(--xy-edge-persona)", strokeWidth: 1.5, strokeDasharray: "4 4" } },
    { id: "e-persona-cfs", source: "persona-cfs", target: "lane-fcz", type: "smoothstep", data: { kind: "persona" }, className: "edge-persona", style: { stroke: "var(--xy-edge-persona)", strokeWidth: 1.5, strokeDasharray: "4 4" } },
    { id: "e-persona-ff", source: "persona-ff", target: "lane-fcz", type: "smoothstep", data: { kind: "persona" }, className: "edge-persona", style: { stroke: "var(--xy-edge-persona)", strokeWidth: 1.5, strokeDasharray: "4 4" } },
  ]
}

/** Digital twin overlay edges: twin → lane */
export function buildTwinEdges(): WorkflowEdge[] {
  return [
    { id: "e-twin-zone", source: "twin-zone-graph", target: "lane-fiz", type: "smoothstep", data: { kind: "twin" }, className: "edge-twin", style: { stroke: "var(--xy-twin)", strokeWidth: 1.5, strokeDasharray: "2 4" } },
    { id: "e-twin-pareto", source: "twin-pareto", target: "lane-fcz", type: "smoothstep", data: { kind: "twin" }, className: "edge-twin", style: { stroke: "var(--xy-twin)", strokeWidth: 1.5, strokeDasharray: "2 4" } },
    { id: "e-twin-whatif", source: "twin-whatif", target: "lane-close", type: "smoothstep", data: { kind: "twin" }, className: "edge-twin", style: { stroke: "var(--xy-twin)", strokeWidth: 1.5, strokeDasharray: "2 4" } },
  ]
}

/** Marks the edges that lie on the selected downstream path. */
export function withPathHighlight(
  edges: WorkflowEdge[],
  onPathIds: ReadonlySet<string>,
): WorkflowEdge[] {
  return edges.map((edge) =>
    onPathIds.has(edge.source) && onPathIds.has(edge.target)
      ? { ...edge, className: `${edge.className ?? ""} edge-on-path`.trim() }
      : edge,
  )
}

/** Case-insensitive search across steps, notes, and agents. */
export function searchWorkflow(query: string): Set<string> {
  const trimmed = query.trim().toLowerCase()
  if (trimmed === "") return new Set<string>()

  const matches = new Set<string>()
  const matchesText = (haystack: readonly string[]): boolean =>
    haystack.some((value) => value.toLowerCase().includes(trimmed))

  for (const step of WORKFLOW_STEPS) {
    if (matchesText([step.title, step.sub, step.event, step.agent, step.description])) {
      matches.add(step.id)
    }
  }
  for (const note of NOTE_DEFINITIONS) {
    if (matchesText([note.title, note.sub, note.event, note.description])) {
      matches.add(note.id)
    }
  }
  for (const agent of AGENTS) {
    if (matchesText([agent.name, agent.role, ...agent.events])) {
      matches.add(`ag-${agent.id}`)
    }
  }
  return matches
}

export type { Edge }
