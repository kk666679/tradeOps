'use client';
import * as React from 'react';
import { DigitalTwinCanvas } from '@/components/workflow-studio/digital-twin/canvas';
import { SAMPLE_TWIN, type TwinSnapshot } from '@/lib/digital-twin/types';

export interface DigitalTwinStudioProps { initial?: TwinSnapshot; className?: string; }

export function DigitalTwinStudio({ initial = SAMPLE_TWIN, className }: DigitalTwinStudioProps) {
  const [snapshot] = React.useState<TwinSnapshot>(initial);
  const [selected, setSelected] = React.useState<string | null>(null);
  const node = snapshot.nodes.find((n) => n.id === selected);
  return (
    <div className={`grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] ${className ?? ''}`}>
      <DigitalTwinCanvas nodes={snapshot.nodes} edges={snapshot.edges} selectedId={selected} onSelect={setSelected} />
      <aside className="rounded-lg border bg-card p-4">
        <h3 className="mb-2 text-sm font-semibold">Selection</h3>
        {node ? (
          <dl className="space-y-1 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">ID</dt><dd className="font-mono">{node.id}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Label</dt><dd>{node.label}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Kind</dt><dd className="capitalize">{node.kind}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Status</dt><dd className="capitalize">{node.status ?? '—'}</dd></div>
          </dl>
        ) : <p className="text-xs text-muted-foreground">Click a node on the canvas.</p>}
        <div className="mt-4 border-t pt-3 text-xs text-muted-foreground">
          {snapshot.nodes.length} nodes · {snapshot.edges.length} edges<br />
          Updated {new Date(snapshot.updatedAt).toLocaleTimeString('en-MY')}
        </div>
      </aside>
    </div>
  );
}
export default DigitalTwinStudio;
