'use client';

import type {
  Accreditation,
  BrokerageWorkflow,
} from '@/components/brokerage/types';

// Empty — real data comes from the brokerage workflow procedure once it lands.
export const SAMPLE_ACCREDITATION: Accreditation = {
  id: '',
  code: '',
  label: '',
  status: 'pending',
  expiresAt: undefined,
};
export const SAMPLE_ACCREDITATIONS: Accreditation[] = [SAMPLE_ACCREDITATION];

const EMPTY_WORKFLOW: BrokerageWorkflow = { nodes: [], edges: [] };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BrokerageWorkflowGraph(_props: any) {
  return (
    <div
      role="note"
      className="rounded-lg border border-dashed border-muted-foreground/40 bg-muted/20 p-6 text-sm"
    >
      <p className="font-medium">Brokerage workflow graph</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Not yet implemented. Placeholder with {EMPTY_WORKFLOW.nodes.length} nodes.
      </p>
    </div>
  );
}

export default BrokerageWorkflowGraph;

/* ---------------- Sample data (empty until procedures land) ------- */

import type { BrokerClient, Declaration } from '@/components/brokerage/types';

export const SAMPLE_CLIENT: BrokerClient = {
  id: '',
  name: '',
  tier: 'TRIAL',
  sla: 'BASIC',
  status: 'active',
  assignedBrokers: [],
  authorization: {},
};

export const SAMPLE_DECLARATION: Declaration = {
  id: '',
  reference: '',
  formCode: '',
  type: '',
  status: 'draft',
  clientId: '',
  clientName: '',
  port: '',
  owningBroker: '',
  lineItems: [],
  totalDeclaredValue: 0,
  approvals: [],
  documents: {},
  createdAt: new Date(0).toISOString(),
};
