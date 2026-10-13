'use client';
import * as React from 'react';
import type { TwinNodeData } from '@/lib/digital-twin/types';

const FILL: Record<TwinNodeData['kind'], string> = {
  supplier: '#8b5cf6', plant: '#0ea5e9', dc: '#f59e0b', customer: '#10b981',
};
const RING: Record<NonNullable<TwinNodeData['status']>, string> = {
  ok: '#22c55e', warn: '#f59e0b', error: '#ef4444',
};

export interface TwinNodeProps { node: TwinNodeData; selected?: boolean; onClick?: (id: string) => void; }

export function TwinNode({ node, selected, onClick }: TwinNodeProps) {
  return (
    <g onClick={() => onClick?.(node.id)} className="cursor-pointer">
      <circle cx={node.x} cy={node.y} r={26} fill={FILL[node.kind]} opacity={0.9}
              stroke={selected ? '#0ea5e9' : node.status ? RING[node.status] : 'transparent'}
              strokeWidth={selected ? 3 : 2} />
      <text x={node.x} y={node.y + 4} textAnchor="middle" fontSize="10" fill="white" fontWeight="600">
        {node.label.slice(0, 6)}
      </text>
      <text x={node.x} y={node.y + 42} textAnchor="middle" fontSize="11" fill="currentColor">{node.label}</text>
    </g>
  );
}
export default TwinNode;
