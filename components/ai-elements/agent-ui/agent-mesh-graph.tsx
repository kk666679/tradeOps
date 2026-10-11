'use client';

/**
 * AgentMeshGraph
 * AiElements 2026 · composed surface. Replace body with real logic.
 */

import * as React from 'react';

export interface MeshNode { id: string; label: string; kind?: 'router' | 'agent' | 'tool'; x?: number; y?: number; }
export interface MeshEdge { from: string; to: string; when?: string; }
export interface AgentMeshGraphProps { nodes?: MeshNode[]; edges?: MeshEdge[]; onSelect?: (id: string) => void; }

export function AgentMeshGraph({ nodes = [], edges = [], onSelect }: AgentMeshGraphProps) {
  const tone = (k?: string) => k === 'router' ? 'bg-violet-50 border-violet-200' : k === 'tool' ? 'bg-sky-50 border-sky-200' : 'bg-background';
  return (
    <div className="relative h-[420px] w-full OverflowHidden rounded border bg-muted/30">
      <svg className="absolute Inset0 h-full w-full" aria-hidden>
        {edges.map((e, i) => {
          const a = nodes.find((n) => n.id === e.from); const b = nodes.find((n) => n.id === e.to);
          if (!a || !b) return null;
          return <line key={i} x1={a.x ?? 0} y1={a.y ?? 0} x2={b.x ?? 0} y2={b.y ?? 0} stroke="currentColor" strokeOpacity={0.3} />;
        })}
      </svg>
      {nodes.map((n) => (
        <button key={n.id} onClick={() => onSelect?.(n.id)} className={'absolute rounded border Px2 Py1 text-xs shadow ' + tone(n.kind)} style={{ left: n.x ?? 20, top: n.y ?? 20 }}>{n.label}</button>
      ))}
    </div>
  );
}

export default AgentMeshGraph;
