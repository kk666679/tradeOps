'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { trpc } from '@/lib/trpc/client';
import { nodeTypes } from '@/components/workflow-studio/nodes/registry';
import type { Accreditation } from '@/components/workflow-studio/brokerage/types';
import { toXYFlow } from './adapt';

/**
 * Sample accreditations. The live list comes from tRPC when a tenantId
 * is provided; this constant is a fallback for static previews.
 * TODO: replace with persisted data from tradeOps.brokerage.getAccreditations
 */
export const SAMPLE_ACCREDITATION: Accreditation[] = [];

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
  const { data: workflow, isLoading } = useQuery({
    queryKey: ['brokerage-workflow', tenantId],
    queryFn: () => trpc.tradeOps.declarations.getWorkflow.query({ tenantId }),
    enabled: !!tenantId,
  });

  const { data: accreditations } = useQuery({
    queryKey: ['accreditations', tenantId],
    queryFn: () => trpc.tradeOps.brokerage.getAccreditations.query({ tenantId }),
    enabled: !!tenantId,
  });

  // Domain → canvas. Memoized; stable across re-renders unless data changes.
  const graph = useMemo(
    () => toXYFlow(workflow?.nodes ?? [], workflow?.edges ?? []),
    [workflow],
  );

  if (isLoading || !workflow) {
    return (
      <div className={`rounded-lg border border-dashed border-muted-foreground/40 bg-muted/20 p-6 text-sm ${className}`}>
        <p className="font-medium">Brokerage workflow graph</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {isLoading ? 'Loading workflow…' : 'No workflow found for this tenant.'}
        </p>
      </div>
    );
  }

  return (
    <div className={`h-96 w-full ${className}`}>
      <div className="h-full">
        <ReactFlow
          nodes={graph.nodes}
          edges={graph.edges}
          nodeTypes={nodeTypes}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.2}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
        >
          <Background />
          <Controls showInteractive={false} />
          <MiniMap
            pannable
            zoomable
            nodeColor={(n) => {
              const kind = (n.data as { kind?: string })?.kind;
              switch (kind) {
                case 'start':    return '#10b981';
                case 'task':     return '#3b82f6';
                case 'approval': return '#f59e0b';
                case 'decision': return '#8b5cf6';
                case 'end':      return '#f43f5e';
                default:         return '#475569';
              }
            }}
          />
        </ReactFlow>
      </div>

      {accreditations && accreditations.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium">Accreditations</h4>
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
