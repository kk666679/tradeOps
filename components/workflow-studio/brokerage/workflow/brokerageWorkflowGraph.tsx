'use client';

import { useQuery } from '@tanstack/react-query';
import { trpc } from '@/lib/trpc/client';
import type { Accreditation, BrokerageWorkflow } from '@/components/workflow-studio/brokerage/types';
import { Nodes, Edges, useReactFlow, Connection, Edge, Node, addEdge } from '@xyflow/react';
import { AccreditationStatusBadge } from '@/components/trade-ops/brokerage/AccreditationStatusBadge';

const DEFAULT_NODES: Nodes = [];
const DEFAULT_EDGES: Edges = [];

export function BrokerageWorkflowGraph({ 
  tenantId,
  className = '',
}: { 
  tenantId: string;
  className?: string;
}) {
  const { data: workflow } = useQuery({
    queryKey: ['brokerage-workflow', tenantId],
    queryFn: () => trpc.tradeOps.declarations.getWorkflow.query({ tenantId }),
    enabled: !!tenantId,
  });

  const { data: accreditations } = useQuery({
    queryKey: ['accreditations', tenantId],
    queryFn: () => trpc.tradeOps.brokerage.getAccreditations.query({ tenantId }),
    enabled: !!tenantId,
  });

  const nodes = workflow?.nodes ?? DEFAULT_NODES;
  const edges = workflow?.edges ?? DEFAULT_EDGES;

  if (!workflow) {
    return (
      <div className={`rounded-lg border border-dashed border-muted-foreground/40 bg-muted/20 p-6 text-sm ${className}`}>
        <p className="font-medium">Brokerage workflow graph</p>
        <p className="mt-1 text-xs text-muted-foreground">Loading workflow...</p>
      </div>
    );
  }

  return (
    <div className={`h-96 w-full ${className}`}>
      <div className="h-full">
        <ReactFlowProvider nodes={nodes} edges={edges}>
          <ReactFlow />
        </ReactFlowProvider>
      </div>
      {accreditations && accreditations.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="font-medium text-sm">Accreditations</h4>
          <div className="flex flex-wrap gap-2">
            {accreditations.map((acc) => (
              <AccreditationStatusBadge key={acc.id} accreditation={acc} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ReactFlowProvider({ nodes, edges, children }: { nodes: Nodes; edges: Edges; children: React.ReactNode }) {
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={({ id, type }) => { }}
      onEdgesChange={({ id, type }) => { }}
      onConnect={() => { }}
      fitView
      attributionPosition="bottom-right"
    >
      {children}
    </ReactFlow>
  );
}

function ReactFlow() {
  const { fitView } = useReactFlow();
  
  return (
    <>
      <Background />
      <Controls />
      <MiniMap />
    </>
  );
}

import { Background, Controls, MiniMap } from '@xyflow/react';
import { ReactFlow, Background as ReactFlowBackground, Controls as ReactFlowControls, MiniMap as ReactFlowMiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const AccreditationStatusBadge = ({ accreditation }: { accreditation: Accreditation }) => {
  const statusColors: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-800',
    EXPIRING_SOON: 'bg-yellow-100 text-yellow-800',
    RENEWAL_FILED: 'bg-blue-100 text-blue-800',
    RENEWAL_OVERDUE: 'bg-orange-100 text-orange-800',
    SUSPENDED: 'bg-red-100 text-red-800',
    CANCELLED: 'bg-gray-100 text-gray-800',
    EXPIRED: 'bg-gray-100 text-gray-800',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[accreditation.status] || 'bg-gray-100 text-gray-800'}`}>
      {accreditation.code} - {accreditation.label}
    </span>
  );
};

export default BrokerageWorkflowGraph;