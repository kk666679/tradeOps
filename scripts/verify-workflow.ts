/**
 * Workflow invariant check.
 *
 * Verifies that the TypeScript conversion preserved the reference HTML
 * implementation exactly: node inventory and positions, edge inventory and
 * handle validity, event identifiers, and the 19-agent directory.
 *
 * Run: npx jiti scripts/verify-workflow.ts
 */
import assert from "node:assert/strict"

import { AGENTS, STEP_AGENT_LINKS } from "../components/fiz-fcz/workflow/data/agents"
import { CLOSE_OUT_STEPS } from "../components/fiz-fcz/workflow/data/closeOut"
import { FCZ_STEPS } from "../components/fiz-fcz/workflow/data/fczSteps"
import { FIZ_STEPS } from "../components/fiz-fcz/workflow/data/fizSteps"
import {
  LAYOUT,
  NOTE_BY_ID,
  STEP_BY_ID,
  WORKFLOW_STEPS,
  buildAgentEdges,
  buildBaseEdges,
  buildExceptionEdges,
  buildReferenceEdges,
  buildWorkflowNodes,
  downstreamOf,
  nextStepId,
  previousStepId,
  resolveWorkflowItem,
  searchWorkflow,
  upstreamOf,
} from "../components/fiz-fcz/workflow/workflowGraph"

let checks = 0
function check(label: string, fn: () => void): void {
  try {
    fn()
    checks += 1
    console.log(`  ok  ${label}`)
  } catch (error) {
    console.error(`FAIL  ${label}`)
    throw error
  }
}

/* ---------------------------------------------------------------------------
   1. Event identifiers — verbatim from the reference HTML
   -------------------------------------------------------------------------- */

const EXPECTED_EVENTS = [
  "fiz.raw.received",
  "fiz.machinery.approved",
  "fiz.production.consumed",
  "fiz.scrap.excised",
  "fiz.fg.produced",
  "fiz.export.confirmed",
  "fcz.inbound.received",
  "fcz.transhipment.completed",
  "fcz.breakbulk.split",
  "fcz.repack.value_added",
  "fcz.reexport.confirmed",
  "fcz.entrepot.matched",
  "ledger.duty.reconciled",
  "audit.period.closed",
  "ledger.append",
  "risk.hold.raised",
  "zone.transfer.fiz_fcz",
]

console.log("\nEvent identifiers")
check("all 17 reference event ids are present", () => {
  const events = [
    ...WORKFLOW_STEPS.map((step) => step.event),
    ...[...NOTE_BY_ID.values()].map((note) => note.event),
  ]
  for (const expected of EXPECTED_EVENTS) {
    assert.ok(events.includes(expected), `missing event ${expected}`)
  }
  assert.equal(events.length, EXPECTED_EVENTS.length)
})

check("no duplicate event ids", () => {
  const events = [
    ...WORKFLOW_STEPS.map((s) => s.event),
    ...[...NOTE_BY_ID.values()].map((n) => n.event),
  ]
  assert.equal(new Set(events).size, events.length)
})

/* ---------------------------------------------------------------------------
   2. Agent directory — all 19 agents with their reference roles
   -------------------------------------------------------------------------- */

console.log("\nAgent directory")
const EXPECTED_AGENTS: Record<string, string> = {
  orchestrator: "State machine · SLA · retries",
  ledger: "Append-only hash chain",
  customs: "Declarations · HS · permits",
  inventory: "Stock · lot / serial · location",
  inbound: "Raw material intake",
  machinery: "HS 84 / 85 · asset approval",
  bomyield: "Consumption · variance",
  waste: "Reason codes · excise",
  production: "Output · cost roll-up",
  export: "Exit confirmation",
  receiving: "ASN · QC · putaway",
  transhipment: "Bonded port moves",
  breakbulk: "Parent / child split",
  repack: "Kitting · labelling",
  reexport: "Zero-duty exit",
  entrepot: "Import ↔ export match",
  recon: "Duty suspension close",
  auditor: "Evidence · audit trail",
  risk: "Anomalies · holds · alerts",
}

check("all 19 agents preserved with roles", () => {
  assert.equal(AGENTS.length, 19)
  for (const agent of AGENTS) {
    assert.equal(agent.role, EXPECTED_AGENTS[agent.id], `role mismatch for ${agent.id}`)
  }
})

check("every step maps to the reference agent name", () => {
  const expectedAgentByStep: Record<string, string> = {
    "fiz-1": "Inbound Agent",
    "fiz-2": "Machinery Agent",
    "fiz-3": "BOM / Yield Agent",
    "fiz-4": "Waste Agent",
    "fiz-5": "Production Agent",
    "fiz-6": "Export Agent",
    "fcz-1": "FCZ Receiving Agent",
    "fcz-2": "Transhipment Agent",
    "fcz-3": "Break-bulk Agent",
    "fcz-4": "Repackaging Agent",
    "fcz-5": "Re-export Agent",
    "fcz-6": "Entrepot Agent",
    "close-recon": "Reconciliation Agent",
    "close-audit": "Auditor Agent",
  }
  for (const step of WORKFLOW_STEPS) {
    assert.equal(step.agent, expectedAgentByStep[step.id], `agent mismatch for ${step.id}`)
  }
  assert.equal(STEP_AGENT_LINKS.length, 14)
})

/* ---------------------------------------------------------------------------
   3. Node inventory and positions
   -------------------------------------------------------------------------- */

console.log("\nNodes")
const referenceNodes = buildWorkflowNodes({ includeAgents: true, showOverlays: false })
const previewNodes = buildWorkflowNodes({ includeAgents: false, showOverlays: false })
const overlayNodes = buildWorkflowNodes({ includeAgents: true, showOverlays: true })

check("reference graph: 4 lanes + 14 steps + 3 notes + 19 agents = 40 nodes", () => {
  const count = (type: string) => referenceNodes.filter((node) => node.type === type).length
  assert.equal(count("lane"), 4)
  assert.equal(count("step"), 14)
  assert.equal(count("note"), 3)
  assert.equal(count("agent"), 19)
  assert.equal(referenceNodes.length, 40)
})

check("marketing preview: 20 nodes, no agents and no overlays", () => {
  assert.equal(previewNodes.length, 20)
  assert.equal(previewNodes.filter((node) => node.type === "lane").length, 3)
  assert.equal(previewNodes.filter((node) => node.type === "step").length, 14)
  assert.equal(previewNodes.filter((node) => node.type === "note").length, 3)
  assert.equal(previewNodes.filter((node) => node.type === "agent").length, 0)
})

check("app scope adds the twin lane and 18 overlay nodes", () => {
  // 5 lanes (reference 4 + twin lane) + 14 steps + 3 control notes + 18 overlays + 19 agents
  assert.equal(overlayNodes.length, 59)
  assert.equal(overlayNodes.filter((node) => node.type === "lane").length, 5)
  assert.equal(overlayNodes.filter((node) => node.type === "note").length, 21)
  assert.ok(overlayNodes.length > referenceNodes.length)
})

check("lanes keep the reference geometry", () => {
  const lane = (id: string) => referenceNodes.find((node) => node.id === id)
  const fiz = lane("lane-fiz")
  assert.deepEqual(fiz?.position, { x: 0, y: 0 })
  assert.equal(fiz?.style?.width, LAYOUT.lane.fiz.width)
  assert.equal(fiz?.style?.height, LAYOUT.lane.fiz.height)
  assert.deepEqual(lane("lane-fcz")?.position, { x: 600, y: 0 })
  assert.deepEqual(lane("lane-close")?.position, { x: 1040, y: 0 })
  assert.deepEqual(lane("lane-agents")?.position, { x: 0, y: 1060 })
  assert.equal(lane("lane-agents")?.style?.width, 1400)
})

check("FIZ steps run top → bottom, FCZ steps bottom → top", () => {
  FIZ_STEPS.forEach((definition, index) => {
    const node = referenceNodes.find((n) => n.id === definition.id)
    assert.ok(node?.parentId === "lane-fiz")
    assert.equal(node?.position.y, LAYOUT.step.y0 + index * LAYOUT.step.dy)
    assert.equal(node?.extent, "parent")
    assert.equal(node?.draggable, false)
    assert.equal(node?.style?.width, LAYOUT.step.width)
    assert.equal(node?.style?.height, LAYOUT.step.height)
  })
  FCZ_STEPS.forEach((definition, index) => {
    const node = referenceNodes.find((n) => n.id === definition.id)
    assert.equal(node?.position.y, LAYOUT.step.y0 + (FCZ_STEPS.length - 1 - index) * LAYOUT.step.dy)
  })
})

check("bridge + close-out notes and agents keep reference positions", () => {
  assert.deepEqual(referenceNodes.find((n) => n.id === "zone-transfer")?.position, { x: 395, y: 795 })
  assert.deepEqual(referenceNodes.find((n) => n.id === "close-recon")?.position, { x: 20, y: 70 })
  assert.deepEqual(referenceNodes.find((n) => n.id === "close-audit")?.position, { x: 20, y: 250 })
  assert.deepEqual(referenceNodes.find((n) => n.id === "close-ledger")?.position, { x: 20, y: 450 })
  assert.deepEqual(referenceNodes.find((n) => n.id === "close-risk")?.position, { x: 20, y: 610 })

  const agents = referenceNodes.filter((n) => n.type === "agent")
  agents.forEach((node, index) => {
    const column = index % 6
    const row = Math.floor(index / 6)
    assert.equal(node.position.x, LAYOUT.agent.x0 + column * LAYOUT.agent.dx)
    assert.equal(node.position.y, LAYOUT.agent.y0 + row * LAYOUT.agent.dy)
  })
})

/* ---------------------------------------------------------------------------
   4. Edges: inventory, handles, targets
   -------------------------------------------------------------------------- */

console.log("\nEdges")
/* Mirrors the handles each custom node renders (all hidden by CSS). */
const HANDLES: Record<string, string[]> = {
  step: ["t", "l", "b", "r"],
  note: ["t", "l", "b", "r"],
  agent: ["t", "l", "b", "r"],
  lane: [],
}

function validateEdges(
  edges: { id: string; source: string; target: string; sourceHandle?: string | null; targetHandle?: string | null }[],
  label: string,
  availableNodes: readonly { id: string; type?: string }[],
): void {
  const nodeMap = new Map(availableNodes.map((node) => [node.id, node]))
  for (const edge of edges) {
    const source = nodeMap.get(edge.source)
    const target = nodeMap.get(edge.target)
    assert.ok(source, `${label}: unknown source ${edge.source}`)
    assert.ok(target, `${label}: unknown target ${edge.target}`)
    const sourceType = source.type ?? ""
    const targetType = target.type ?? ""
    if (edge.sourceHandle) {
      assert.ok(
        (HANDLES[sourceType] ?? []).includes(edge.sourceHandle),
        `${label}: source ${edge.source} (${sourceType}) has no handle ${edge.sourceHandle}`,
      )
    }
    if (edge.targetHandle) {
      assert.ok(
        (HANDLES[targetType] ?? []).includes(edge.targetHandle),
        `${label}: target ${edge.target} (${targetType}) has no handle ${edge.targetHandle}`,
      )
    }
    assert.ok(edge.id.length > 0, `${label}: edge without id`)
  }
}

check("edge ids are unique within every edge set", () => {
  const sets = [
    buildReferenceEdges(),
    buildBaseEdges(),
    buildAgentEdges(),
    buildExceptionEdges(),
  ]
  for (const edges of sets) {
    const ids = edges.map((edge) => edge.id)
    assert.equal(new Set(ids).size, ids.length, "duplicate edge id")
  }
})

check("reference edges: 15, valid against the reference node set", () => {
  const base = buildReferenceEdges()
  assert.equal(base.length, 15)
  validateEdges(base, "reference", referenceNodes)
})

check("reference edges also fit the marketing preview node set", () => {
  validateEdges(buildReferenceEdges(), "preview", previewNodes)
})

check("agent edges: 14 animated links, all agents exist", () => {
  const agentEdges = buildAgentEdges()
  assert.equal(agentEdges.length, 14)
  for (const edge of agentEdges) {
    assert.equal(edge.animated, true)
    assert.equal(edge.sourceHandle, "b")
    assert.equal(edge.targetHandle, "t")
  }
  validateEdges(agentEdges, "agent", referenceNodes)
})

check("exception edges: step → exception/hold note", () => {
  const exceptions = buildExceptionEdges()
  validateEdges(exceptions, "exception", referenceNodes)
  for (const edge of exceptions) {
    assert.equal(edge.sourceHandle, "r")
    assert.equal(edge.targetHandle, "l")
  }
})

check("app-scope base edges are valid against the overlay node set", () => {
  validateEdges(buildBaseEdges(), "base", overlayNodes)
})

check("main flow connects FIZ → transfer → FCZ → close-out", () => {
  const base = buildReferenceEdges()
  const sourceFor = (target: string) => base.filter((edge) => edge.target === target).map((edge) => edge.source)
  assert.deepEqual(sourceFor("fiz-2"), ["fiz-1"])
  assert.deepEqual(sourceFor("zone-transfer"), ["fiz-6"])
  assert.deepEqual(sourceFor("fcz-1"), ["zone-transfer"])
  assert.deepEqual(sourceFor("fcz-2"), ["fcz-1"])
  assert.deepEqual(sourceFor("close-recon"), ["fcz-6"])
  assert.deepEqual(sourceFor("close-audit"), ["close-recon"])
  assert.deepEqual(sourceFor("close-ledger"), ["close-audit"])
})

check("edge set has no dangling reference to a missing agent", () => {
  const agentIds = new Set(referenceNodes.filter((node) => node.type === "agent").map((node) => node.id))
  for (const edge of [...buildBaseEdges(), ...buildAgentEdges()]) {
    if (edge.source.startsWith("ag-")) assert.ok(agentIds.has(edge.source), `dangling ${edge.source}`)
    if (edge.target.startsWith("ag-")) assert.ok(agentIds.has(edge.target), `dangling ${edge.target}`)
  }
})

/* ---------------------------------------------------------------------------
   5. Graph helpers
   -------------------------------------------------------------------------- */

console.log("\nHelpers")
check("downstream/upstream traversal covers the whole flow", () => {
  assert.deepEqual([...downstreamOf("fiz-1")].sort(), [
    "close-audit",
    "close-ledger",
    "close-recon",
    "fcz-1",
    "fcz-2",
    "fcz-3",
    "fcz-4",
    "fcz-5",
    "fcz-6",
    "fiz-1",
    "fiz-2",
    "fiz-3",
    "fiz-4",
    "fiz-5",
    "fiz-6",
    "zone-transfer",
  ])
  assert.deepEqual([...upstreamOf("close-audit")].sort(), [
    "close-audit",
    "close-recon",
    "fcz-1",
    "fcz-2",
    "fcz-3",
    "fcz-4",
    "fcz-5",
    "fcz-6",
    "fiz-1",
    "fiz-2",
    "fiz-3",
    "fiz-4",
    "fiz-5",
    "fiz-6",
    "zone-transfer",
  ])
})

check("step navigation walks the main flow in order", () => {
  assert.equal(nextStepId("fiz-6"), "zone-transfer")
  assert.equal(nextStepId("zone-transfer"), "fcz-1")
  assert.equal(nextStepId("fcz-6"), "close-recon")
  assert.equal(nextStepId("close-audit"), undefined)
  assert.equal(previousStepId("fcz-1"), "zone-transfer")
  assert.equal(previousStepId("fiz-1"), undefined)
})

check("search matches events, agents, and titles", () => {
  assert.ok(searchWorkflow("reexport").has("fcz-5"))
  assert.ok(searchWorkflow("Entrepot").has("fcz-6"))
  assert.ok(searchWorkflow("fiz.raw.received").has("fiz-1"))
  assert.ok(searchWorkflow("bom").size >= 1)
  assert.equal(searchWorkflow("   ").size, 0)
  assert.equal(searchWorkflow("zzzz-not-present").size, 0)
})

check("resolveWorkflowItem returns steps and notes only", () => {
  assert.equal(resolveWorkflowItem("fiz-3")?.kind, "step")
  assert.equal(resolveWorkflowItem("zone-transfer")?.kind, "note")
  assert.equal(resolveWorkflowItem("ag-inbound"), undefined)
  assert.equal(resolveWorkflowItem("lane-fiz"), undefined)
})

check("step data payload carries event, agent, zone, and neighbours", () => {
  const fiz3 = previewNodes.find((node) => node.id === "fiz-3")
  assert.ok(fiz3?.type === "step")
  if (fiz3?.type === "step") {
    assert.equal(fiz3.data.event, "fiz.production.consumed")
    assert.equal(fiz3.data.agent, "BOM / Yield Agent")
    assert.equal(fiz3.data.zoneLabel, "FIZ")
    assert.deepEqual(fiz3.data.upstream, ["fiz-2"])
    assert.deepEqual(fiz3.data.downstream, ["fiz-4"])
  }

  const fcz6 = previewNodes.find((node) => node.id === "fcz-6")
  assert.ok(fcz6?.type === "step")
  if (fcz6?.type === "step") {
    assert.equal(fcz6.data.event, "fcz.entrepot.matched")
    assert.equal(fcz6.data.agent, "Entrepot Agent")
    assert.equal(fcz6.data.zoneLabel, "FCZ")
  }

  const recon = previewNodes.find((node) => node.id === "close-recon")
  assert.ok(recon?.type === "step")
  if (recon?.type === "step") {
    assert.equal(recon.data.zoneLabel, "LEDGER")
    assert.equal(recon.data.step, "R")
  }

  const transfer = previewNodes.find((node) => node.id === "zone-transfer")
  assert.ok(transfer?.type === "note")
  if (transfer?.type === "note") {
    assert.equal(transfer.data.event, "zone.transfer.fiz_fcz")
  }
})

check("agent data payload carries name, role, and owned events", () => {
  const inbound = referenceNodes.find((node) => node.id === "ag-inbound")
  assert.ok(inbound?.type === "agent")
  if (inbound?.type === "agent") {
    assert.equal(inbound.data.name, "Inbound Agent")
    assert.equal(inbound.data.role, "Raw material intake")
    assert.deepEqual(inbound.data.events, ["fiz.raw.received"])
  }
})

check("every step definition is resolvable by id", () => {
  for (const step of [...FIZ_STEPS, ...FCZ_STEPS, ...CLOSE_OUT_STEPS]) {
    assert.equal(STEP_BY_ID.get(step.id), step)
  }
  assert.equal(WORKFLOW_STEPS.length, 14)
})

console.log(`\n${checks} checks passed.`)
