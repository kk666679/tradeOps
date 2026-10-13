'use client';
import * as React from 'react';
import { TwinNode } from './TwinNode';
import type { TwinEdgeData, TwinNodeData } from '@/lib/digital-twin/types';

export interface DigitalTwinCanvasProps {
  nodes: TwinNodeData[]; edges?: TwinEdgeData[];
  width?: number; height?: number;
  selectedId?: string | null; onSelect?: (id: string) => void;
}

export function DigitalTwinCanvas({
  nodes, edges = [], width = 900, height = 500, selectedId, onSelect,
}: DigitalTwinCanvasProps) {
  const map = React.useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full rounded-lg border bg-card">
      <defs>
        <marker id="tw-arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#94a3b8" />
        </marker>
      </defs>
      {edges.map((e) => {
        const a = map.get(e.from); const b = map.get(e.to);
        if (!a || !b) return null;
        return <line key={e.id} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#94a3b8"
                     strokeWidth={Math.max(1, Math.min(6, (e.volume ?? 1) / 40))}
                     markerEnd="url(#tw-arrow)" />;
      })}
      {nodes.map((n) => (
        <TwinNode key={n.id} node={n} selected={selectedId === n.id} onClick={onSelect} />
      ))}
    </svg>
  );
}
export default DigitalTwinCanvas;
