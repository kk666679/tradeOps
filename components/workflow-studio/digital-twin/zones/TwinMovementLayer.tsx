'use client';
import * as React from 'react';
import type { TwinNodeData } from '@/lib/digital-twin/types';

export interface Movement {
  id: string; fromId: string; toId: string;
  progress: number;                       // 0..1
  mode?: 'sea' | 'air' | 'road' | 'rail';
  status?: 'ok' | 'delayed' | 'exception';
}

export interface TwinMovementLayerProps {
  nodes: TwinNodeData[];
  movements?: Movement[];
  onSelect?: (id: string) => void;
}

const COLOR: Record<NonNullable<Movement['status']>, string> = {
  ok: '#22c55e', delayed: '#f59e0b', exception: '#ef4444',
};

const SAMPLE: Movement[] = [
  { id: 'm1', fromId: 'n1', toId: 'n2', progress: 0.62, mode: 'sea',  status: 'ok' },
  { id: 'm2', fromId: 'n2', toId: 'n3', progress: 0.28, mode: 'road', status: 'delayed' },
  { id: 'm3', fromId: 'n3', toId: 'n4', progress: 0.85, mode: 'road', status: 'ok' },
];

export function TwinMovementLayer({ nodes, movements = SAMPLE, onSelect }: TwinMovementLayerProps) {
  const map = React.useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  return (
    <g>
      {movements.map((m) => {
        const a = map.get(m.fromId); const b = map.get(m.toId);
        if (!a || !b) return null;
        const x = a.x + (b.x - a.x) * m.progress;
        const y = a.y + (b.y - a.y) * m.progress;
        const c = COLOR[m.status ?? 'ok'];
        return (
          <g key={m.id} onClick={() => onSelect?.(m.id)} className="cursor-pointer">
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={c} strokeWidth={2}
                  strokeDasharray="6 4" opacity={0.6} />
            <circle cx={x} cy={y} r={6} fill={c} stroke="white" strokeWidth={2} />
            <title>{`${a.label} → ${b.label} · ${Math.round(m.progress * 100)}%`}</title>
          </g>
        );
      })}
    </g>
  );
}
export default TwinMovementLayer;
