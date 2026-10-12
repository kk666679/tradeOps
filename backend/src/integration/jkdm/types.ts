// backend/src/integrations/jkdm/types.ts

export type JkdmMode = "production" | "development" | "manual";

export type DeclarationFormCode = "K1" | "K2" | "K3" | "K7" | "K8" | "K9";

export type CustomsChannel = "GREEN" | "YELLOW" | "RED" | "UNASSIGNED";

/** Provenance of every result this module produces. Never spoofed. */
export type Provenance =
  | "production_api"       // verified external transport
  | "manual_observation"   // recorded by a human, evidence-backed
  | "synthetic";           // dev adapter only

/**
 * A capability is enabled only when the operation is genuinely implemented
 * AND the current mode + config permits it. Callers must check before acting.
 */
export interface JkdmCapabilities {
  submitDeclaration: boolean;
  queryDeclarationStatus: boolean;
  submitManifest: boolean;
  queryManifest: boolean;
  /** True when the caller must use recordManualResponse instead. */
  requiresManualRecording: boolean;
}

export interface DeclarationLineItem {
  lineNumber: number;
  hsCode: string;
  description: string;
  quantity: number;
  uom: string;
  unitValueMYR: number;
  countryOfOrigin: string;
  preferenceScheme?: "ATIGA" | "ACFTA" | "RCEP" | "CPTPP" | "MJEPA" | "MCFTA" | "MFN";
  permitRefs?: string[];
}

export interface DeclarationSubmission {
  draftRef: string;
  idempotencyKey: string;
  tenantId: string;
  brokerCode: string;
  formCode: DeclarationFormCode;
  procedureCode: string;
  portOfEntry: string;
  importerName: string;
  importerRegistration: string;
  exporterName: string;
  exporterCountry: string;
  blNumber: string;
  invoiceNumber: string;
  invoiceDate: string;
  currency: string;
  totalFOB: number;
  totalFreight: number;
  totalInsurance: number;
  totalCIFMYR: number;
  lineItems: DeclarationLineItem[];
}

export interface SubmissionResult {
  provenance: Provenance;
  synthetic: boolean;
  acknowledged: boolean;
  /** Set only when a verified transport confirmed acceptance. */
  externalRef?: string;
  /** Set only when a verified transport returned a channel. */
  channel?: CustomsChannel;
  submittedAt: string;
  /** Correlation id for audit and reconciliation. Always set. */
  correlationId: string;
  errors?: Array<{ code: string; message: string; field?: string }>;
}

export type DeclarationStatusKind =
  | "submitted"
  | "query"
  | "inspection"
  | "released"
  | "rejected"
  | "amended"
  | "integration_error"
  | "unknown";

export interface DeclarationStatus {
  declarationRef: string;
  provenance: Provenance;
  synthetic: boolean;
  channel: CustomsChannel;
  status: DeclarationStatusKind;
  queryText?: string;
  inspectedAt?: string;
  releasedAt?: string;
  rejectionReason?: string;
  lastCheckedAt: string;
}

export interface ManualResponse {
  draftRef: string;
  idempotencyKey: string;
  tenantId: string;
  recordedBy: string;

  /** Mandatory: what JKDM communicated. */
  outcome: Exclude<DeclarationStatusKind, "submitted" | "unknown" | "integration_error">;

  /** External reference. Mandatory unless a documented exception is recorded. */
  externalRef?: string;
  /** When externalRef is unavailable, the exception must explain why. */
  exceptionReason?: string;

  /** Officer details. Optional; record what is available, note what is not. */
  officerName?: string;
  officerId?: string;

  /** Free-text notes from the broker. */
  notes?: string;

  /** When JKDM communicated the outcome. */
  observedAt: string;

  /** Evidence pointer. Required unless an exception is recorded. */
  evidenceRef?: string;

  /** Additional evidence, e.g. multiple scans. */
  additionalEvidenceRefs?: string[];
}

export interface ManualResponseRecord {
  recordId: string;
  provenance: "manual_observation";
  draftRef: string;
  tenantId: string;
  recordedBy: string;
  outcome: ManualResponse["outcome"];
  externalRef?: string;
  exceptionReason?: string;
  officerName?: string;
  officerId?: string;
  notes?: string;
  observedAt: string;
  evidenceRef?: string;
  additionalEvidenceRefs?: string[];
  recordedAt: string;
  /** Review state. Manual records are not authoritative until reviewed. */
  reviewStatus: "pending_review" | "reviewed" | "rejected";
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface JkdmAdapter {
  readonly mode: JkdmMode;
  readonly capabilities: JkdmCapabilities;

  submitDeclaration(input: DeclarationSubmission): Promise<SubmissionResult>;
  getDeclarationStatus(declarationRef: string): Promise<DeclarationStatus>;
  recordManualResponse(input: ManualResponse): Promise<ManualResponseRecord>;
}

/* ------------------------------------------------------------------ */
/* Error taxonomy                                                     */
/* ------------------------------------------------------------------ */

export class IntegrationNotConfiguredError extends Error {
  readonly code = "INTEGRATION_NOT_CONFIGURED";
  constructor(message = "JKDM integration is not configured") { super(message); this.name = "IntegrationNotConfiguredError"; }
}

export class IntegrationUnavailableError extends Error {
  readonly code = "INTEGRATION_UNAVAILABLE";
  constructor(message = "JKDM integration is enabled but the transport is not verified") { super(message); this.name = "IntegrationUnavailableError"; }
}

export class DevAdapterRefusedError extends Error {
  readonly code = "DEV_ADAPTER_REFUSED";
  constructor(message = "Dev adapter refused to run") { super(message); this.name = "DevAdapterRefusedError"; }
}

export class ManualEvidenceRequiredError extends Error {
  readonly code = "MANUAL_EVIDENCE_REQUIRED";
  constructor(message = "Manual response requires evidence or a documented exception") { super(message); this.name = "ManualEvidenceRequiredError"; }
}

export class UnsupportedOperationError extends Error {
  readonly code = "UNSUPPORTED_OPERATION";
  constructor(message = "This operation is not supported by the current adapter") { super(message); this.name = "UnsupportedOperationError"; }
}
