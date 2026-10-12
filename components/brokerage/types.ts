// Brokerage domain types — reconstructed from consumer usage.
// TODO: reconcile against backend/src/trpc/trpc.router.ts once procedures land.

/* ---------------- Clients ---------------- */

export interface BrokerAuthorization {
  written?: boolean;
  reference?: string;
  signedAt?: string;
  signedBy?: string;
  status?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  scope?: string[];
  issuedBy?: string;
}

export type BrokerTier =
  | 'TRIAL' | 'STANDARD' | 'PREFERRED' | 'ENTERPRISE'
  | 'trial' | 'standard' | 'preferred' | 'enterprise' | 'growth'
  | string;

export type BrokerSla =
  | 'BASIC' | 'STANDARD' | 'PRIORITY' | 'CRITICAL'
  | 'basic' | 'standard' | 'priority' | 'critical'
  | string;

export interface BrokerClient {
  id: string;
  name: string;
  meta?: string;
  email?: string;
  contactEmail?: string;
  phone?: string;
  country?: string;
  status?: string;

  registrationNumber?: string;
  registeredState?: string;
  tier?: BrokerTier;
  sla?: BrokerSla;
  monthlyVolume?: number;

  authorization?: BrokerAuthorization;
  onboardedAt?: string;

  /** Array of broker handle strings, e.g. ["aisha.rahman", "daniel.okafor"]. */
  assignedBrokers?: string[];
}

/* ---------------- Declarations ---------------- */

export interface BrokerLineItem {
  id: string;
  hsCode: string;
  description: string;
  quantity: number;
  unit: string;
  unitValue: number;
  totalValue: number;
  dutyRate?: number;
  dutyAmount?: number;
  hsConfidence?: number;
  preferenceScheme?: string;
  currency?: string;
  salesTaxAmount?: number;
  exciseAmount?: number;
  classifiedBy?: string;
  classifiedAt?: string;
}

export interface BrokerApproval {
  id: string;
  role?: string;
  name?: string;
  status?: 'pending' | 'approved' | 'rejected' | string;
  at?: string;
  note?: string;
  actor?: string;
  decision?: string;
  comment?: string;
  borangCReference?: string;
}

/** A declaration's document references — keys, not an array of files. */
export interface BrokerDeclarationDocuments {
  invoiceRef?: string;
  blRef?: string;
  packingRef?: string;
}

/** Kept for backwards compatibility; not used by Declaration.documents. */
export interface BrokerDocument {
  id: string;
  kind: string;
  name: string;
  url?: string;
  uploadedAt: string;
}

export interface Declaration {
  id: string;
  reference: string;
  formCode: string;
  type: string;
  status: string;
  clientId: string;
  clientName: string;
  port: string;
  owningBroker: string;
  lineItems: BrokerLineItem[];
  totalDeclaredValue: number;
  approvals: BrokerApproval[];
  documents: BrokerDeclarationDocuments;
  createdAt: string;
  updatedAt?: string;

  /* Optional accounting + workflow fields used by mock data. */
  jurisdiction?: string;
  currency?: string;
  totalDuty?: number;
  totalSalesTax?: number;
  totalExcise?: number;
  borangCReference?: string;
  draftedBy?: string;
  submittedBy?: string;
  approvedBy?: string;

  /* Safety valve — mock data may carry additional fields.
     The real router output will replace this. */
  [key: string]: unknown;
}

/* ---------------- Workflow graph ---------------- */

export interface WorkflowNode {
  id: string;
  label: string;
  kind?: string;
  status?: string;
}

export interface WorkflowEdge {
  from: string;
  to: string;
  label?: string;
}

export interface BrokerageWorkflow {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export interface Accreditation {
  id: string;
  code: string;
  label: string;
  status: 'active' | 'expired' | 'pending';
  expiresAt?: string;
  licenceNumber?: string;
  ejenType?: string;
}
