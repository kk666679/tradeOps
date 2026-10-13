'use client';
import * as React from 'react';
import type { TwinNode } from './TwinGraph';

interface Props { nodes: TwinNode[]; viewport?: { x: number; y: number; w: number; h: number }; width?: number; height?: number; }

export function TwinMiniMap({ nodes, viewport, width = 180, height = 120 }: Props) {
  const maxX = Math.max(...nodes.map((n) => n.x), 1);
  const maxY = Math.max(...nodes.map((n) => n.y), 1);
  const sx = width / maxX, sy = height / maxY;
  return (
    <div className="rounded-md border bg-card/90 p-1 shadow-sm">
      <svg width={width} height={height}>
        <rect width={width} height={height} fill="transparent" stroke="#cbd5e1" strokeWidth="1" />
        {viewport && (
          <rect x={viewport.x * sx} y={viewport.y * sy} width={viewport.w * sx} height={viewport.h * sy}
                fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth="1" />
        )}
        {nodes.map((n) => (
          <circle key={n.id} cx={n.x * sx} cy={n.y * sy} r={3} fill="#64748b" />
        ))}
      </svg>
    </div>
  );
}
export default TwinMiniMap;
