'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type Edge,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { trpc } from '@/lib/trpc/client';
import type { Accreditation } from '@/components/workflow-studio/brokerage/types';

const DEFAULT_NODES: Node[] = [];
const DEFAULT_EDGES: Edge[] = [];

function AccreditationStatusBadge({ accreditation }: { accreditation: Accreditation }) {
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
    <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[accreditation.status] ?? 'bg-gray-100 text-gray-800'}`}>
      {accreditation.code} - {accreditation.label}
    </span>
  );
}

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

  const nodes = (workflow?.nodes ?? DEFAULT_NODES) as Node[];
  const edges = (workflow?.edges ?? DEFAULT_EDGES) as Edge[];

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
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={() => {}}
          onEdgesChange={() => {}}
          onConnect={() => {}}
          fitView
          attributionPosition="bottom-right"
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>

      {accreditations && accreditations.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="font-medium text-sm">Accreditations</h4>
          <div className="flex flex-wrap gap-2">
            {accreditations.map((acc: Accreditation) => (
              <AccreditationStatusBadge key={acc.id} accreditation={acc} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default BrokerageWorkflowGraph;