'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Canvas } from '@/components/ai-elements/canvas';
import { Node, NodeHeader, NodeTitle, NodeDescription, NodeContent } from '@/components/ai-elements/node';
import { Panel } from '@/components/ai-elements/panel';
import { Connection } from '@/components/ai-elements/connection';

export interface MeshNode {
  id: string;
  label: string;
  zone?: 'FIZ' | 'FCZ' | 'BONDED';
  status?: 'ok' | 'warn' | 'down';
  x?: number;
  y?: number;
}
export interface MeshEdge { from: string; to: string; label?: string }
export interface MeshViewProps {
  className?: string;
  data?: unknown;
  nodes?: MeshNode[];
  edges?: MeshEdge[];
  title?: string;
  onSelect?: (id: string) => void;
}

const ZONE_TINT: Record<string, string> = {
  FIZ: 'border-sky-200 bg-sky-50/60',
  FCZ: 'border-amber-200 bg-amber-50/60',
  BONDED: 'border-violet-200 bg-violet-50/60',
};

function toFlow(nodes: MeshNode[], edges: MeshEdge[]) {
  const flowNodes = nodes.map((n, i) => ({
    id: n.id,
    position: { x: n.x ?? 60 + (i % 4) * 220, y: n.y ?? 60 + Math.floor(i / 4) * 160 },
    data: { label: n.label },
    type: 'meshNode',
  }));
  const flowEdges = edges.map((e, i) => ({ id: `e-${i}`, source: e.from, target: e.to, label: e.label }));
  return { flowNodes, flowEdges };
}

const nodeTypes = {
  meshNode: ({ data, selected }: { data: { label: string; zone?: string; status?: string; id?: string }; selected?: boolean }) => (
    <Node handles={{ target: true, source: true }} className={selected ? 'ring-2 ring-primary' : undefined}>
      <NodeHeader><NodeTitle>{String(data.label)}</NodeTitle></NodeHeader>
      <NodeContent>
        <NodeDescription>{data.zone ?? ''} {data.status ? `· ${data.status}` : ''}</NodeDescription>
      </NodeContent>
    </Node>
  ),
};

/** Agent-mesh topology — XYFlow canvas composed from ai-elements primitives. */
export function MeshView({ className, data, nodes, edges, title = 'Mesh topology', onSelect }: MeshViewProps) {
  const raw = React.useMemo<MeshNode[]>(() => {
    if (nodes?.length) return nodes;
    if (Array.isArray((data as { nodes?: MeshNode[] })?.nodes)) return (data as { nodes: MeshNode[] }).nodes;
    return [
      { id: 'gateway', label: 'Integration gateway', zone: 'FIZ', status: 'ok' },
      { id: 'customs', label: 'Customs bridge', zone: 'FIZ', status: 'ok' },
      { id: 'wms', label: 'WMS bridge', zone: 'FCZ', status: 'ok' },
      { id: 'tms', label: 'TMS bridge', zone: 'FCZ', status: 'warn' },
      { id: 'edi', label: 'EDI / ASYCUDA', zone: 'BONDED', status: 'ok' },
    ];
  }, [nodes, data]);
  const rawEdges = React.useMemo<MeshEdge[]>(() => {
    if (edges?.length) return edges;
    if (Array.isArray((data as { edges?: MeshEdge[] })?.edges)) return (data as { edges: MeshEdge[] }).edges;
    return [
      { from: 'gateway', to: 'customs' },
      { from: 'gateway', to: 'wms' },
      { from: 'gateway', to: 'tms' },
      { from: 'customs', to: 'edi' },
    ];
  }, [edges, data]);
  const { flowNodes } = toFlow(raw, rawEdges);
  const enriched = flowNodes.map((n) => {
    const meta = raw.find((r) => r.id === n.id);
    return { ...n, data: { ...n.data, zone: meta?.zone, status: meta?.status, id: n.id } };
  });

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>FIZ / FCZ / bonded agents — select a node to drill in</CardDescription>
        </div>
        <div className="flex gap-1.5">
          {['FIZ', 'FCZ', 'BONDED'].map((z) => (
            <Badge key={z} variant="outline" className={ZONE_TINT[z]}>{z}</Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[420px] w-full overflow-hidden rounded-lg border bg-muted/20">
          <Canvas nodes={enriched} edges={rawEdges.map((e, i) => ({ id: `e-${i}`, source: e.from, target: e.to }))} nodeTypes={nodeTypes} connectionLineComponent={Connection} onNodeClick={(_, n) => onSelect?.(n.id)}>
            <Panel position="bottom-right">agents: {raw.length} · links: {rawEdges.length}</Panel>
          </Canvas>
        </div>
        <pre className="mt-2 max-h-32 overflow-auto rounded bg-muted/30 p-2 text-[11px] text-muted-foreground">{JSON.stringify(data ?? { nodes: raw.length, edges: rawEdges.length }, null, 2)}</pre>
      </CardContent>
    </Card>
  );
}

export default MeshView;

