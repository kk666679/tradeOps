// components/brokerage/workflow/brokerageWorkflowGraph.ts
import { MarkerType } from "@xyflow/react";
import { REGULATORY } from "../constants";
import type {
  AccreditationData, AccreditationNodeData, AgentNodeData,
  BrokerageEdge, BrokerageNode, ClientNodeData, ComplianceNodeData,
  DeclarationNodeData, HumanGateNodeData, LaneNodeData,
} from "../types";
import type { RegulatoryControl } from "../types";
import { JKDM_CONTROL_CATALOG } from "../regulatory";

export const BROKERAGE_LAYOUT = {
  laneHeaderWidth: 180, stepWidth: 240, columnGap: 64, rowGap: 40, laneHeight: 280,
} as const;

export const CANONICAL_LANES: LaneNodeData[] = [
  { laneId: "lane-operations",     label: "Operations",            layer: "operations",    phase: "intake",
    description: "Shipment intake, declaration preparation, document evidence." },
  { laneId: "lane-regulatory",     label: "Regulatory controls",   layer: "regulatory",    phase: "accreditation",
    description: "Configurable rules — accreditation, permits, duties, channel instructions, bond requirements." },
  { laneId: "lane-authorization",  label: "Authorization",         layer: "authorization", phase: "filing",
    description: "Accreditation, delegated authority, human approval, release eligibility, decision evidence." },
  { laneId: "lane-engagement",     label: "Client engagement",     layer: "engagement",    phase: "engagement",
    description: "Onboarding under §90(1)(b) — written authorization from the importer/exporter/manufacturer." },
];

/* ============================================================
 * Build accreditation nodes from the control catalog
 *
 * One node per mandatory control. The node carries the control ID so
 * the UI can drill down to the exact reference and version.
 * ============================================================ */

export function buildAccreditationNodes(
  data: AccreditationData,
  catalog: RegulatoryControl[],
  laneY: number, stepX0: number, colW: number, rowH: number
): BrokerageNode[] {
  const nodes: BrokerageNode[] = [];
  const relevant = catalog.filter((c) =>
    c.evaluator === "AGENT_ACCREDITATION"
    || c.evaluator === "SERVICE_TAX_REGISTRATION"
    || c.evaluator === "BOND_VALIDITY"
    || c.evaluator === "RENEWAL_WINDOW"
    || c.evaluator === "ID_PASS_STATUS"
    || c.evaluator === "DUE_DILIGENCE"
  );

  const daysToExpiry = Math.floor((new Date(data.expiresAt).getTime() - Date.now()) / 86_400_000);
  const activeCert = data.certificateHolders.filter((h) => h.active).length;
  const renewalOpen = daysToExpiry <= REGULATORY.RENEWAL_WINDOW_DAYS;

  const stateFor = (id: string): { state?: string; deadlineDays?: number } => {
    switch (id) {
      case "agent.section90.active":      return { state: data.status };
      case "agent.service-tax.registered":return { state: data.serviceTaxRegistration };
      case "agent.cert-holders.minimum":  return { state: `${activeCert} active` };
      case "agent.bumiputera.threshold":  return { state: `${data.bumiputeraActual ?? 0}% / ${data.bumiputeraThreshold ?? 0}%` };
      case "agent.bond.valid":            return { state: `${data.bond.status} · RM ${data.bond.amount.toLocaleString()}` };
      case "agent.renewal.window":        return { state: data.renewalFiled ? "Filed" : `${daysToExpiry}d`, deadlineDays: daysToExpiry };
      case "agent.id-pass.active":        return { state: `${data.idPassesIssued} issued · ${data.idPassesLost} lost` };
      case "agent.due-diligence.kod-etika": return { state: data.kodEtikaAcknowledged ? "Acknowledged" : "Pending" };
      case "client.agent-limit-per-state":return { state: `${REGULATORY.MAX_AGENTS_PER_CLIENT_PER_STATE} max` };
      default: return {};
    }
  };

  relevant.forEach((c, i) => {
    const col = i % 5;
    const row = Math.floor(i / 5);
    const isBlocking = c.severity === "BLOCK";
    const isRenewalOpen = c.id === "agent.renewal.window" && renewalOpen && !data.renewalFiled;
    const status = isRenewalOpen ? "blocked" : "done";
    const severity = c.severity === "BLOCK" ? "block" : c.severity === "WARNING" ? "warn" : "info";
    const stateInfo = stateFor(c.id);

    const node: AccreditationNodeData = {
      stepId: `accred-${c.id}`,
      controlId: c.id,
      label: c.name,
      summary: c.description,
      section: c.references[0]?.section ?? "§90",
      status,
      severity: isBlocking ? severity : (severity === "block" ? "warn" : severity),
      ruleVersion: c.version,
      references: c.references,
      ...stateInfo,
    };

    nodes.push({
      id: node.stepId,
      type: "accreditation",
      position: { x: stepX0 + col * colW, y: laneY + row * rowH },
      data: node,
      draggable: false,
    });
  });

  return nodes;
}

/* ============================================================
 * Canonical agents, gates, rules
 * ============================================================ */

export const CANONICAL_AGENTS: AgentNodeData[] = [
  { agentId: "document.agent",      name: "Document Extraction Agent",   role: "document", capabilities: ["extract-invoice", "extract-packing-list", "cross-reconcile"], nodeStatus: "pending" },
  { agentId: "customs.classifier",  name: "HS Classification Agent",     role: "customs",  capabilities: ["classify-hs", "ruling-lookup", "ahtn-lookup"], nodeStatus: "pending" },
  { agentId: "customs.valuation",   name: "Valuation Agent",             role: "customs",  capabilities: ["transaction-value", "related-party-check"], nodeStatus: "pending" },
  { agentId: "customs.origin",      name: "Origin Determination Agent",  role: "customs",  capabilities: ["determine-origin", "atiga-check", "rcep-check"], nodeStatus: "pending" },
  { agentId: "customs.permit",      name: "Permit Agent",                role: "permit",   capabilities: ["identify-agency", "track-permit"], nodeStatus: "pending" },
  { agentId: "customs.duty",        name: "Duty & Tax Agent",            role: "customs",  capabilities: ["compute-customs-duty", "compute-sst", "fta-preference"], nodeStatus: "pending" },
  { agentId: "customs.declaration", name: "Declaration Drafting Agent",  role: "customs",  capabilities: ["draft-k1", "draft-k2", "draft-k8", "draft-k9"], nodeStatus: "pending" },
  { agentId: "risk.agent",          name: "Risk & Anomaly Agent",        role: "risk",     capabilities: ["detect-anomaly", "valuation-anomaly"], nodeStatus: "pending" },
];

export const CANONICAL_HUMAN_GATES: HumanGateNodeData[] = [
  { gateId: "gate-client-authorization", label: "Client written authorization", requiredRole: "broker",
    regulation: "§90(1)(b)", slaMinutes: 1440, nodeStatus: "pending",
    description: "Confirm a signed authorization letter from the client is on file. Without it, no action may be taken on their behalf." },
  { gateId: "gate-broker-signoff", label: "Licensed broker sign-off", requiredRole: "broker",
    regulation: "§90(1)", slaMinutes: 60, nodeStatus: "pending",
    description: "The assigned licensed broker reviews the draft declaration, applies their Borang C / digital signature. Legal liability attaches at this point." },
  { gateId: "gate-senior-review", label: "Senior broker review", requiredRole: "senior_broker",
    slaMinutes: 30, nodeStatus: "pending",
    description: "Required when: classification conflict, related-party valuation, FTA preference uncertainty, or duty delta above threshold." },
  { gateId: "gate-compliance-signoff", label: "Compliance sign-off", requiredRole: "compliance",
    slaMinutes: 30, nodeStatus: "pending",
    description: "Required when: sanctions escalation, novel commodity, new client, or post-audit exposure flagged." },
  { gateId: "gate-jkdm-inspection", label: "JKDM officer inspection", requiredRole: "principal",
    slaMinutes: 240, nodeStatus: "pending",
    description: "Red Lane assignment requires physical examination at port. Joint inspection with SIRIM / MAQIS where applicable." },
];

export const CANONICAL_COMPLIANCE_RULES: ComplianceNodeData[] = [
  { ruleId: "agent-limit", label: "3-agent limit per state", action: "warn", category: "regulatory", legalRef: "§8",
    description: "Importers/exporters/manufacturers may appoint a maximum of 3 Forwarding or Shipping Agents per state.",
    nodeStatus: "pending" },
  { ruleId: "form-purpose", label: "Form purpose verified", action: "deny", category: "regulatory", legalRef: "JKDM Forms Reference",
    description: "Form code purposes must be verified against the current JKDM prescribed-forms reference.",
    nodeStatus: "pending" },
];

/* ============================================================
 * Builder
 * ============================================================ */

export interface BuildBrokerageGraphOptions {
  accreditation?: AccreditationData;
  client?: ClientNodeData;
  declaration?: DeclarationNodeData;
  includeAgents?: boolean;
  includeCompliance?: boolean;
  includeInspection?: boolean;
  /** The active rule set. Defaults to the canonical JKDM catalog. */
  catalog?: RegulatoryControl[];
}

export function buildBrokerageWorkflowGraph(
  options: BuildBrokerageGraphOptions = {}
): { nodes: BrokerageNode[]; edges: BrokerageEdge[] } {
  const {
    includeCompliance = true, includeInspection = true,
    catalog = JKDM_CONTROL_CATALOG,
  } = options;

  const nodes: BrokerageNode[] = [];
  const edges: BrokerageEdge[] = [];

  const laneX = 0;
  const stepX0 = BROKERAGE_LAYOUT.laneHeaderWidth + 40;
  const colW = BROKERAGE_LAYOUT.stepWidth + BROKERAGE_LAYOUT.columnGap;
  const laneY0 = 60;
  const laneH = BROKERAGE_LAYOUT.laneHeight;
  const rowH = 90;

  const laneIndex: Record<string, number> = {};
  CANONICAL_LANES.forEach((lane, i) => {
    laneIndex[lane.laneId] = i;
    nodes.push({
      id: lane.laneId, type: "lane",
      position: { x: laneX, y: laneY0 + i * laneH },
      data: lane, draggable: false, selectable: false,
    });
  });

  // Layer 1 — Operations
  const opsY = laneY0 + laneIndex["lane-operations"] * laneH + 30;
  [
    { id: "step-doc-upload",    agent: "document.agent", title: "Document intake" },
    { id: "step-doc-extract",   agent: "document.agent", title: "OCR extraction" },
    { id: "step-doc-reconcile", agent: "document.agent", title: "Cross-document reconcile" },
  ].forEach((s, i) => {
    const agent = CANONICAL_AGENTS.find((a) => a.agentId === s.agent);
    if (!agent) return;
    nodes.push({ id: s.id, type: "agent", position: { x: stepX0 + i * colW, y: opsY },
      data: { ...agent, name: s.title, nodeStatus: "pending" }, draggable: false });
  });

  // Layer 2 — Regulatory controls (from the catalog)
  const regY = laneY0 + laneIndex["lane-regulatory"] * laneH + 30;
  if (options.accreditation) {
    nodes.push(...buildAccreditationNodes(options.accreditation, catalog, regY, stepX0, colW, rowH));
  }

  // Layer 3 — Authorization
  const authY = laneY0 + laneIndex["lane-authorization"] * laneH + 30;
  [
    { id: "gate-broker-signoff",     kind: "human-gate" as const, data: CANONICAL_HUMAN_GATES[1] },
    { id: "gate-senior-review",      kind: "human-gate" as const, data: CANONICAL_HUMAN_GATES[2] },
    { id: "gate-compliance-signoff", kind: "human-gate" as const, data: CANONICAL_HUMAN_GATES[3] },
    { id: "step-ucustoms-submit",    kind: "agent" as const, agent: "customs.declaration", title: "UCustoms EDI submission" },
    { id: "step-channel-assign",     kind: "agent" as const, agent: "risk.agent", title: "JKDM channel assignment" },
  ].forEach((s, i) => {
    const x = stepX0 + i * colW;
    if (s.kind === "human-gate" && s.data) {
      nodes.push({ id: s.id, type: "human-gate", position: { x, y: authY }, data: s.data, draggable: false });
    } else if (s.kind === "agent" && s.agent) {
      const agent = CANONICAL_AGENTS.find((a) => a.agentId === s.agent);
      if (!agent) return;
      nodes.push({ id: s.id, type: "agent", position: { x, y: authY },
        data: { ...agent, name: s.title ?? agent.name, nodeStatus: "pending" }, draggable: false });
    }
  });

  if (includeInspection) {
    nodes.push({
      id: "gate-jkdm-inspection", type: "human-gate",
      position: { x: stepX0 + 5 * colW, y: authY },
      data: CANONICAL_HUMAN_GATES[4], draggable: false,
    });
  }

  // Layer 4 — Engagement
  const engY = laneY0 + laneIndex["lane-engagement"] * laneH + 30;
  if (options.client) {
    nodes.push({ id: `client-${options.client.clientId}`, type: "client",
      position: { x: stepX0, y: engY }, data: options.client, draggable: false });
  }
  nodes.push({ id: CANONICAL_HUMAN_GATES[0].gateId, type: "human-gate",
    position: { x: stepX0 + colW, y: engY }, data: CANONICAL_HUMAN_GATES[0], draggable: false });

  if (includeCompliance) {
    CANONICAL_COMPLIANCE_RULES.forEach((rule, i) => {
      nodes.push({ id: `rule-${rule.ruleId}`, type: "compliance",
        position: { x: stepX0 + i * (BROKERAGE_LAYOUT.stepWidth + 20), y: engY + 150 },
        data: rule, draggable: false });
    });
  }

  /* -------- Edges -------- */

  const defaultEdge = {
    type: "smoothstep" as const, animated: false,
    markerEnd: { type: MarkerType.ArrowClosed, width: 14, height: 14, color: "#26262b" },
    style: { stroke: "#26262b", strokeWidth: 1.75 },
  };
  const regulatoryGateEdge = {
    type: "smoothstep" as const, animated: false,
    markerEnd: { type: MarkerType.ArrowClosed, width: 12, height: 12, color: "#ef4444" },
    style: { stroke: "#ef4444", strokeWidth: 1.25, strokeDasharray: "4 4" },
  };

  // Regulatory-gate edges carry the control IDs evaluated on that path.
  const gateControlIds = catalog
    .filter((c) => c.mandatory && c.evaluator !== "CHANNEL_REVIEW" && c.evaluator !== "FORM_PURPOSE")
    .map((c) => c.id);

  catalog
    .filter((c) => c.evaluator === "AGENT_ACCREDITATION" || c.evaluator === "SERVICE_TAX_REGISTRATION" || c.evaluator === "BOND_VALIDITY")
    .forEach((c) => {
      edges.push({
        id: `reg-gate-${c.id}-gate-broker-signoff`,
        source: `accred-${c.id}`,
        target: "gate-broker-signoff",
        data: {
          kind: "regulatory-gate",
          regulation: c.references[0]?.section ?? "§90",
          controlIds: gateControlIds,
        },
        ...regulatoryGateEdge,
      });
    });

  if (options.client) {
    edges.push({ id: "edge-client-auth", source: `client-${options.client.clientId}`,
      target: "gate-client-authorization", data: { kind: "handoff" }, ...defaultEdge });
  }
  edges.push({ id: "edge-auth-limit",  source: "gate-client-authorization", target: "rule-agent-limit",
    data: { kind: "handoff" }, ...defaultEdge });
  edges.push({ id: "edge-limit-intake", source: "rule-agent-limit", target: "step-doc-upload",
    data: { kind: "handoff" }, ...defaultEdge });

  const opEdges: Array<[string, string, string]> = [
    ["step-doc-upload", "step-doc-extract", "handoff"],
    ["step-doc-extract", "step-doc-reconcile", "handoff"],
    ["step-doc-reconcile", "gate-broker-signoff", "handoff"],
    ["gate-broker-signoff", "gate-senior-review", "approval"],
    ["gate-senior-review", "gate-compliance-signoff", "approval"],
    ["gate-compliance-signoff", "step-ucustoms-submit", "approval"],
    ["step-ucustoms-submit", "step-channel-assign", "handoff"],
    ["step-channel-assign", "gate-jkdm-inspection", "conditional"],
  ];
  opEdges.forEach(([source, target, kind], idx) => {
    edges.push({
      id: `edge-op-${idx}-${source}-${target}`, source, target,
      data: { kind: kind as "handoff" | "approval" | "conditional" },
      ...defaultEdge,
    });
  });

  return { nodes, edges };
}

/* ============================================================
 * Sample data
 * ============================================================ */

export const SAMPLE_ACCREDITATION: AccreditationData = {
  ejenType: "penghantaran",
  licenceNumber: "EK/PPG/2026/00842",
  status: "active",
  approvalPeriod: "2-year",
  issuedAt: "2024-06-15", expiresAt: "2026-06-15",
  renewalWindowOpensAt: "2026-03-17", renewalFiled: false,
  registrationType: "companies-act-2016",
  paidUpCapital: 250_000, capitalRequired: 100_000, capitalCompliant: true,
  certificateHolders: [
    { id: "ch-1", name: "Aisha Rahman",  icNumber: "820315-14-xxxx", role: "director", courseType: "KEK", certificateNumber: "KEK-2023-0412", issuedAt: "2023-08-10", active: true },
    { id: "ch-2", name: "Daniel Okafor", icNumber: "900712-10-xxxx", role: "manager",  courseType: "KEK", certificateNumber: "KEK-2024-0718", issuedAt: "2024-02-22", active: true },
  ],
  certificateHoldersCompliant: true,
  registrationBand: "post-1990",
  bumiputeraRequired: true, bumiputeraThreshold: 51,
  bumiputeraActual: 62, bumiputeraCompliant: true,
  iilsStatus: "approved", iilsApprovedAt: "2020-11-04",
  serviceTaxRegistration: "ST/13/2024/00221", serviceTaxCompliant: true,
  bond: { form: "Borang Kastam No. 6", amount: 10_000, issuedAt: "2024-06-10", expiresAt: "2026-06-15", status: "active", referenceNumber: "BK6/2024/00412" },
  approvedStaff: [
    { id: "st-1", name: "Aisha Rahman",  icNumber: "820315-14-xxxx", position: "Principal Broker", authorizedAt: "2024-06-20", idPassNumber: "EK-ID-0842-01", idPassStatus: "active", certificateHolder: true },
    { id: "st-2", name: "Daniel Okafor", icNumber: "900712-10-xxxx", position: "Senior Broker",    authorizedAt: "2024-06-20", idPassNumber: "EK-ID-0842-02", idPassStatus: "active", certificateHolder: true },
    { id: "st-3", name: "Sarah Lim",     icNumber: "950822-14-xxxx", position: "Broker",           authorizedAt: "2024-08-01", idPassNumber: "EK-ID-0842-03", idPassStatus: "active", certificateHolder: false },
  ],
  idPassesIssued: 3, idPassesLost: 0,
  outstandingTax: false, hangingFormsCount: 0,
  dueDiligenceCompliant: true, kodEtikaAcknowledged: true,
  kodEtikaUrl: REGULATORY.KOD_ETIKA_URL,
};

export const SAMPLE_CLIENT: ClientNodeData = {
  clientId: "cl-meridian",
  name: "Meridian Electronics Sdn Bhd",
  tier: "enterprise", sla: "critical", status: "active",
  monthlyVolume: 412,
  authorized: true, authorizedAt: "2025-08-14",
  registeredState: "Penang",
  nodeStatus: "pending",
};

export const SAMPLE_DECLARATION: DeclarationNodeData = {
  declarationId: "decl-k1-00418",
  reference: "K1/PG/2026/00418",
  formCode: "K1", type: "import",
  status: "classifying", channel: "UNASSIGNED",
  clientName: "Meridian Electronics Sdn Bhd",
  owningBroker: "aisha.rahman",
  draftConfidence: 0.94, flags: [],
  nodeStatus: "pending",
};
