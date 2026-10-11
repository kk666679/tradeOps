'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Canvas } from '@/components/ai-elements/canvas';
import { Node, NodeHeader, NodeTitle, NodeDescription, NodeContent, NodeFooter } from '@/components/ai-elements/node';
import { Panel } from '@/components/ai-elements/panel';
import { Connection } from '@/components/ai-elements/connection';
import { ChainOfThought, ChainOfThoughtHeader, ChainOfThoughtStep, ChainOfThoughtContent } from '@/components/ai-elements/chain-of-thought';

export interface WorkflowStep { id: string; label: string; kind?: string; status?: 'complete' | 'active' | 'pending'; x?: number; y?: number }
export interface WorkflowCanvasProps {
  className?: string;
  data?: unknown;
  steps?: WorkflowStep[];
  edges?: { from: string; to: string }[];
  title?: string;
  onSelect?: (id: string) => void;
}

const stepTypes = {
  wfStep: ({ data, selected }: { data: { label: string; kind?: string; status?: string }; selected?: boolean }) => (
    <Node handles={{ target: true, source: true }} className={selected ? 'ring-2 ring-primary' : undefined}>
      <NodeHeader><NodeTitle>{String(data.label)}</NodeTitle></NodeHeader>
      <NodeContent><NodeDescription>{data.kind ?? 'step'} · {data.status ?? 'pending'}</NodeDescription></NodeContent>
      <NodeFooter><Badge variant={data.status === 'complete' ? 'default' : data.status === 'active' ? 'secondary' : 'outline'}>{String(data.status ?? 'pending')}</Badge></NodeFooter>
    </Node>
  ),
};

/** Clearance workflow — ordered steps on a canvas + reasoning trace. */
export function WorkflowCanvas({ className, data, steps, edges, title = 'Clearance workflow', onSelect }: WorkflowCanvasProps) {
  const list = React.useMemo<WorkflowStep[]>(() => {
    if (steps?.length) return steps;
    if (Array.isArray((data as { steps?: WorkflowStep[] })?.steps)) return (data as { steps: WorkflowStep[] }).steps;
    return [
      { id: 'ingest', label: 'Ingest declaration', kind: 'intake', status: 'complete' },
      { id: 'classify', label: 'HS classify', kind: 'ai', status: 'complete' },
      { id: 'duty', label: 'Duty compute', kind: 'rules', status: 'active' },
      { id: 'permit', label: 'Permit check', kind: 'compliance', status: 'pending' },
      { id: 'release', label: 'Release', kind: 'customs', status: 'pending' },
    ];
  }, [steps, data]);
  const links = React.useMemo(() => {
    if (edges?.length) return edges;
    return list.slice(0, -1).map((s, i) => ({ from: s.id, to: list[i + 1].id }));
  }, [edges, list]);
  const nodes = list.map((s, i) => ({
    id: s.id,
    position: { x: 40 + i * 200, y: 80 },
    data: { label: s.label, kind: s.kind, status: s.status },
    type: 'wfStep',
  }));
  return (
    <Card className={className}>
      <CardHeader><CardTitle>{title}</CardTitle><CardDescription>Select a step to inspect payload</CardDescription></CardHeader>
      <CardContent className="space-y-3">
        <div className="h-[340px] overflow-hidden rounded-lg border bg-muted/20">
          <Canvas nodes={nodes} edges={links.map((e, i) => ({ id: `e-${i}`, source: e.from, target: e.to }))} nodeTypes={stepTypes} connectionLineComponent={Connection} onNodeClick={(_, n) => onSelect?.(n.id)}>
            <Panel position="top-right">steps: {list.length}</Panel>
          </Canvas>
        </div>
        <ChainOfThought defaultOpen={false}>
          <ChainOfThoughtHeader>Execution trace</ChainOfThoughtHeader>
          <ChainOfThoughtContent>
            {list.map((s) => (
              <ChainOfThoughtStep key={s.id} label={s.label} description={s.kind} status={s.status === 'complete' ? 'complete' : s.status === 'active' ? 'active' : 'pending'} />
            ))}
          </ChainOfThoughtContent>
        </ChainOfThought>
        <pre className="max-h-28 overflow-auto rounded bg-muted/30 p-2 text-[11px] text-muted-foreground">{JSON.stringify(data ?? { steps: list.length }, null, 2)}</pre>
      </CardContent>
    </Card>
  );
}

export default WorkflowCanvas;

