// components/brokerage/types.ts
import type { Node, Edge } from "@xyflow/react";

/* ============================================================
 * Section 90 — Customs Act 1967 — Regulatory domain
 * ============================================================ */

export type EjenType = "penghantaran" | "perkapalan" | "pengangkut_barang";

export const EJEN_TYPE_LABEL: Record<EjenType, string> = {
  penghantaran: "Ejen Penghantaran (Forwarding Agent)",
  perkapalan: "Ejen Perkapalan (Shipping Agent)",
  pengangkut_barang: "Ejen Pengangkut Barang (Freight Forwarder)",
};

export type RegistrationBand =
  | "pre-1976" | "1976-1990" | "post-1990" | "iils" | "not-applicable";

export type AccreditationStatus =
  | "active" | "expiring-soon" | "renewal-filed" | "renewal-overdue"
  | "suspended" | "cancelled" | "expired";

export type ApprovalPeriod = "1-year" | "2-year" | "5-year";

export interface BondRecord {
  /** JKDM general bond — Form Kastam No. 6. NOT the same as Kastam No. 7. */
  form: "Borang Kastam No. 6";
  amount: number;
  issuedAt: string;
  expiresAt: string;
  status: "active" | "expired" | "forfeited";
  referenceNumber?: string;
}

export interface CertificateHolder {
  id: string; name: string; icNumber: string;
  role: "director" | "owner" | "manager" | "employee";
  courseType: "KEK" | "KEP";
  certificateNumber: string; issuedAt: string; active: boolean;
  replacementWindowDays?: number;
}

export interface ApprovedStaff {
  id: string; name: string; icNumber: string; position: string;
  authorizedAt: string; idPassNumber?: string;
  idPassStatus: "active" | "lost" | "returned" | "pending";
  idPassIssuedAt?: string; certificateHolder: boolean;
}

export interface AccreditationData {
  ejenType: EjenType;
  licenceNumber: string;
  status: AccreditationStatus;
  approvalPeriod: ApprovalPeriod;
  issuedAt: string; expiresAt: string;
  renewalWindowOpensAt: string; renewalFiled: boolean;
  registrationType: "business-act-1956" | "companies-act-2016";
  paidUpCapital: number; capitalRequired: number; capitalCompliant: boolean;
  certificateHolders: CertificateHolder[];
  certificateHoldersCompliant: boolean;
  registrationBand: RegistrationBand;
  bumiputeraRequired: boolean;
  bumiputeraThreshold?: number;
  bumiputeraActual?: number;
  bumiputeraCompliant?: boolean;
  bumiputeraExemptReason?: "iils-foreign-majority" | "bursa-listed" | "not-applicable";
  iilsStatus?: "approved" | "not-approved" | "not-applicable";
  iilsApprovedAt?: string;
  serviceTaxRegistration: string;
  serviceTaxCompliant: boolean;
  bond: BondRecord;
  approvedStaff: ApprovedStaff[];
  idPassesIssued: number; idPassesLost: number;
  outstandingTax: boolean; hangingFormsCount: number;
  dueDiligenceCompliant: boolean; kodEtikaAcknowledged: boolean;
  kodEtikaUrl: string;
}

/* ============================================================
 * Layer 2 — Client engagement (§90(1)(b))
 * ============================================================ */

export type ClientTier = "starter" | "growth" | "enterprise";
export type ClientStatus = "active" | "onboarding" | "suspended" | "offboarded";
export type ClientSla = "standard" | "priority" | "critical";

export interface ClientAuthorization {
  written: boolean;
  reference?: string;
  signedAt?: string;
  signedBy?: string;
}

export interface BrokerClient {
  id: string; name: string; registrationNumber: string; country: string;
  tier: ClientTier; status: ClientStatus; sla: ClientSla;
  assignedBrokers: string[]; contactEmail: string; monthlyVolume: number;
  onboardedAt?: string; houseRules?: string[]; tags?: string[];
  authorization: ClientAuthorization;
  registeredState: string;
}

/* ============================================================
 * Layer 3 — Declaration lifecycle
 * ============================================================ */

export type DeclarationStatus =
  | "draft" | "awaiting-docs" | "classifying" | "valuing"
  | "origin-check" | "screening" | "permit-check"
  | "awaiting-approval" | "approved" | "filed"
  | "channel-green" | "channel-yellow" | "channel-red"
  | "inspecting" | "duty-paid" | "cleared"
  | "held" | "amended" | "cancelled" | "post-audit";

export type DeclarationType = "import" | "export" | "transit" | "transhipment" | "bonded";

/* ============================================================
 * Configurable regulatory model
 * ============================================================ */

/** JKDM customs declaration form codes. Purposes are configurable. */
export type CustomsFormCode = "K1" | "K2" | "K3" | "K7" | "K8" | "K9";

export const CUSTOMS_FORM_CODES: readonly CustomsFormCode[] =
  ["K1", "K2", "K3", "K7", "K8", "K9"] as const;

/** JKDM risk-management channel (Sistem Pengurusan Risiko). */
export type CustomsChannel = "GREEN" | "YELLOW" | "RED" | "UNASSIGNED";

export type ControlSeverity = "INFO" | "WARNING" | "BLOCK";

export type ControlOutcome = "PASS" | "FAIL" | "REVIEW" | "NOT_APPLICABLE";

/**
 * A regulatory reference attached to a control. The `verificationStatus`
 * field is essential: the UI must never present PENDING_REVIEW or
 * SUPERSEDED references as authoritative.
 */
export interface RegulatoryReference {
  id: string;
  title: string;
  section?: string;
  clause?: string;
  url?: string;
  verifiedAt?: string;
  verificationStatus: "VERIFIED" | "PENDING_REVIEW" | "SUPERSEDED";
}

export type ControlEvaluatorKind =
  | "AGENT_ACCREDITATION"
  | "SERVICE_TAX_REGISTRATION"
  | "BOND_VALIDITY"
  | "CLIENT_AUTHORIZATION"
  | "FORM_PURPOSE"
  | "PERMIT_EVIDENCE"
  | "CHANNEL_REVIEW"
  | "HUMAN_APPROVAL"
  | "ID_PASS_STATUS"
  | "RENEWAL_WINDOW"
  | "DUE_DILIGENCE";

export interface RegulatoryControl {
  id: string;
  name: string;
  description: string;
  jurisdiction: "MY";
  enabled: boolean;

  appliesTo: {
    forms?: CustomsFormCode[];
    channels?: CustomsChannel[];
    offices?: string[];
    transactionTypes?: DeclarationType[];
  };

  severity: ControlSeverity;
  mandatory: boolean;

  effectiveFrom: string;
  effectiveUntil?: string;

  references: RegulatoryReference[];

  evaluator: ControlEvaluatorKind;

  parameters: Record<string, unknown>;
  version: number;
}

export interface ControlEvaluation {
  controlId: string;
  controlVersion: number;
  controlName: string;
  severity: ControlSeverity;
  mandatory: boolean;
  outcome: ControlOutcome;
  reason: string;
  evidenceIds: string[];
  references: RegulatoryReference[];
  evaluatedAt: string;
  evaluatedBy: string;
}

export interface RegulatoryGateResult {
  allowedToProceed: boolean;
  requiresHumanReview: boolean;
  evaluations: ControlEvaluation[];
  blockingControlIds: string[];
  warningControlIds: string[];
  evaluatedAt: string;
  ruleSetVersion: string;
}

/* ============================================================
 * Declaration record — now carries evaluated gate result
 * ============================================================ */

export interface DeclarationFormMeta {
  formCode: CustomsFormCode;
  formName: string;
  formNameMs: string;
  /** Purpose is configurable — must be verified against current JKDM form. */
  purpose: string;
  direction: "import" | "export" | "transit" | "movement" | "traveller";
  /** True when the purpose must be verified per current JKDM forms reference. */
  purposeVerificationRequired?: boolean;
}

export interface DeclarationLineItem {
  id: string; description: string; hsCode: string; hsConfidence: number;
  quantity: number; unit: string; unitValue: number; totalValue: number;
  currency: string; dutyRate?: number; dutyAmount?: number;
  salesTaxAmount?: number; exciseAmount?: number;
  preferenceScheme?: "ATIGA" | "RCEP" | "CPTPP" | "none";
  classifiedBy: "agent" | "broker" | "senior_broker";
}

export type DeclarationFlag =
  | "hs-conflict" | "origin-unclear" | "valuation-review" | "sanctions-hit"
  | "missing-doc" | "sla-breach" | "post-audit-risk"
  | "permit-required" | "permit-missing"
  | "borang-c-inactive" | "client-unauthorized"
  | "capital-deficiency" | "bond-expired" | "id-pass-invalid"
  | "channel-red" | "channel-yellow" | "form-purpose-unverified"
  | "rule-version-superseded";

export interface DeclarationApproval {
  id: string; actor: string;
  role: "broker" | "senior_broker" | "compliance" | "principal";
  decision: "approved" | "rejected" | "returned";
  comment?: string; at: string; borangCReference?: string;
}

export interface Declaration {
  id: string; reference: string; customsReference?: string;
  clientId: string; clientName: string;
  formCode: CustomsFormCode;
  type: DeclarationType;
  status: DeclarationStatus;
  /** Assigned JKDM risk-management channel — distinct from workflow status. */
  channel: CustomsChannel;
  jurisdiction: string; port: string;
  documents: {
    invoiceRef?: string; blRef?: string; packingRef?: string;
    cooRef?: string; permitRefs?: string[];
  };
  lineItems: DeclarationLineItem[];
  totalDeclaredValue: number; currency: string;
  totalDuty: number; totalSalesTax: number; totalExcise: number;
  owningBroker: string; borangCReference?: string;
  draftedBy: string; draftConfidence?: number;
  approvals: DeclarationApproval[];
  eventIds: string[];
  /** Result of the most recent regulatory gate evaluation. */
  gateResult?: RegulatoryGateResult;
  createdAt: string; updatedAt: string;
  slaDeadline?: string; flags: DeclarationFlag[];
}

/* ============================================================
 * Workflow node types
 * ============================================================ */

export type BrokerageNodeType =
  | "lane" | "client" | "declaration" | "agent"
  | "human-gate" | "compliance" | "accreditation";

export type BrokerageNodeStatus =
  | "pending" | "active" | "done" | "blocked" | "error";

export interface LaneNodeData extends Record<string, unknown> {
  laneId: string; label: string; description?: string;
  layer: "operations" | "regulatory" | "authorization" | "engagement";
  phase?:
    | "accreditation" | "continuity" | "engagement" | "intake"
    | "classification" | "duty" | "declaration" | "filing" | "post";
}

export interface ClientNodeData extends Record<string, unknown> {
  clientId: string; name: string; tier: ClientTier; sla: ClientSla;
  status: ClientStatus; monthlyVolume: number;
  authorized: boolean; authorizedAt?: string;
  registeredState: string; nodeStatus: BrokerageNodeStatus;
}

export interface DeclarationNodeData extends Record<string, unknown> {
  declarationId: string; reference: string;
  formCode: CustomsFormCode; type: DeclarationType;
  status: DeclarationStatus; channel: CustomsChannel;
  clientName: string; owningBroker: string;
  draftConfidence?: number; flags: DeclarationFlag[];
  slaDeadline?: string; nodeStatus: BrokerageNodeStatus;
  /** Compact view of the gate outcome for the node badge. */
  gateOutcome?: {
    allowed: boolean;
    blockingCount: number;
    reviewCount: number;
    ruleSetVersion: string;
  };
}

export interface AgentNodeData extends Record<string, unknown> {
  agentId: string; name: string;
  role: "customs" | "document" | "risk" | "ops" | "permit";
  capabilities: string[]; nodeStatus: BrokerageNodeStatus;
}

export interface HumanGateNodeData extends Record<string, unknown> {
  gateId: string; label: string;
  requiredRole: "broker" | "senior_broker" | "compliance" | "principal";
  assignee?: string; slaMinutes?: number;
  regulation?: string; description?: string;
  nodeStatus: BrokerageNodeStatus;
}

export interface ComplianceNodeData extends Record<string, unknown> {
  ruleId: string; label: string;
  action: "allow" | "warn" | "deny" | "escalate";
  description: string;
  category: "regulatory" | "operational" | "due-diligence";
  legalRef?: string; nodeStatus: BrokerageNodeStatus;
}

export interface AccreditationNodeData extends Record<string, unknown> {
  stepId: string; label: string; summary: string;
  section: string; status: BrokerageNodeStatus;
  severity: "info" | "warn" | "block";
  deadlineDays?: number; state?: string; consequence?: string;
  /** The configurable control this step reflects. */
  controlId?: string;
  /** Outcome of the last evaluation of that control. */
  outcome?: ControlOutcome;
  /** References for tooltip / drilldown. */
  references?: RegulatoryReference[];
  ruleVersion?: number;
}

export type BrokerageNode =
  | Node<LaneNodeData, "lane">
  | Node<ClientNodeData, "client">
  | Node<DeclarationNodeData, "declaration">
  | Node<AgentNodeData, "agent">
  | Node<HumanGateNodeData, "human-gate">
  | Node<ComplianceNodeData, "compliance">
  | Node<AccreditationNodeData, "accreditation">;

export type BrokerageEdgeKind =
  | "handoff" | "approval" | "escalation" | "rejection"
  | "parallel" | "regulatory-gate" | "loop" | "conditional";

export interface BrokerageEdgeData extends Record<string, unknown> {
  kind: BrokerageEdgeKind;
  label?: string;
  condition?: string;
  regulation?: string;
  /** For regulatory-gate edges — the specific control IDs evaluated. */
  controlIds?: string[];
}

export type BrokerageEdge = Edge<BrokerageEdgeData>;

export interface PipelineColumnDef {
  id: string; label: string; accent: string; maxCards?: number;
}

export interface BrokerageWorkflowExplorerProps {
  nodes?: BrokerageNode[];
  edges?: BrokerageEdge[];
  layerFilter?: "all" | "operations" | "regulatory" | "authorization" | "engagement";
  phaseFilter?: string;
  selectedNodeId?: string | null;
  onSelectNode?: (id: string | null) => void;
  onNodeOpen?: (node: BrokerageNode) => void;
  height?: number | string;
  className?: string;
  enableSimulation?: boolean;
  /** Current rule set version — shown in toolbar and stamped on evaluations. */
  ruleSetVersion?: string;
}

/* ============================================================
 * Type guards
 * ============================================================ */

export const isLaneNode = (n: BrokerageNode): n is Node<LaneNodeData, "lane"> => n.type === "lane";
export const isClientNode = (n: BrokerageNode): n is Node<ClientNodeData, "client"> => n.type === "client";
export const isDeclarationNode = (n: BrokerageNode): n is Node<DeclarationNodeData, "declaration"> => n.type === "declaration";
export const isAgentNode = (n: BrokerageNode): n is Node<AgentNodeData, "agent"> => n.type === "agent";
export const isHumanGateNode = (n: BrokerageNode): n is Node<HumanGateNodeData, "human-gate"> => n.type === "human-gate";
export const isComplianceNode = (n: BrokerageNode): n is Node<ComplianceNodeData, "compliance"> => n.type === "compliance";
export const isAccreditationNode = (n: BrokerageNode): n is Node<AccreditationNodeData, "accreditation"> => n.type === "accreditation";
