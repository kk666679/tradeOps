'use client';
import * as React from 'react';

export interface TwinNode { id: string; label: string; x: number; y: number; kind?: 'supplier'|'plant'|'dc'|'customer'; }
export interface TwinEdge { id: string; from: string; to: string; volume?: number; }

interface Props { nodes: TwinNode[]; edges: TwinEdge[]; width?: number; height?: number; onSelect?: (id: string) => void; }

const NODE_FILL: Record<NonNullable<TwinNode['kind']>, string> = {
  supplier: '#8b5cf6', plant: '#0ea5e9', dc: '#f59e0b', customer: '#10b981',
};

export function TwinGraph({ nodes, edges, width = 800, height = 480, onSelect }: Props) {
  const nodeMap = React.useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full rounded-lg border bg-card">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#94a3b8" />
        </marker>
      </defs>
      {edges.map((e) => {
        const a = nodeMap.get(e.from); const b = nodeMap.get(e.to);
        if (!a || !b) return null;
        return (
          <line key={e.id} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke="#94a3b8" strokeWidth={Math.max(1, Math.min(6, (e.volume ?? 1) / 20))} markerEnd="url(#arrow)" />
        );
      })}
      {nodes.map((n) => (
        <g key={n.id} onClick={() => onSelect?.(n.id)} className="cursor-pointer">
          <circle cx={n.x} cy={n.y} r={22} fill={NODE_FILL[n.kind ?? 'dc']} opacity={0.9} />
          <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="10" fill="white">{n.label.slice(0, 6)}</text>
          <text x={n.x} y={n.y + 38} textAnchor="middle" fontSize="11" fill="currentColor">{n.label}</text>
        </g>
      ))}
    </svg>
  );
}
export default TwinGraph;
