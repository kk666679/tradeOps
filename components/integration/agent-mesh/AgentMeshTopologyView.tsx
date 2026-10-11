'use client';
import * as React from 'react';
export interface AgentMeshTopologyViewNode { id: string; label: string; x?: number; y?: number; zone?: 'FIZ' | 'FCZ' | 'BONDED'; }
export interface AgentMeshTopologyViewProps { nodes?: AgentMeshTopologyViewNode[]; edges?: { from: string; to: string }[]; className?: string; }
export function AgentMeshTopologyView({ nodes = [], edges = [], className }: AgentMeshTopologyViewProps) {
  const tint = (z?: string) => z === 'FIZ' ? 'bg-sky-50 border-sky-200' : z === 'FCZ' ? 'bg-amber-50 border-amber-200' : z === 'BONDED' ? 'bg-violet-50 border-violet-200' : 'bg-background';
  return (
    <div className={className ?? 'relative h-[420px] w-full overflow-hidden rounded border bg-muted/30'}>
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        {edges.map((e, i) => {
          const a = nodes.find((n) => n.id === e.from);
          const b = nodes.find((n) => n.id === e.to);
          if (!a || !b) return null;
          return <line key={i} x1={a.x ?? 0} y1={a.y ?? 0} x2={b.x ?? 0} y2={b.y ?? 0} stroke="currentColor" strokeOpacity={0.3} />;
        })}
      </svg>
      {nodes.length === 0 ? (
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No nodes</div>
      ) : nodes.map((n) => (
        <div key={n.id} className={'absolute rounded border px-2 py-1 text-xs shadow ' + tint(n.zone)} style={{ left: n.x ?? 20, top: n.y ?? 20 }}>{n.label}</div>
      ))}
    </div>
  );
}
export default AgentMeshTopologyView;
