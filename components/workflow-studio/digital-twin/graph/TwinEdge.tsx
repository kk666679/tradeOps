'use client';

import { memo } from 'react';
import {
  BaseEdge, EdgeLabelRenderer, getBezierPath,
  type EdgeProps,
} from '@xyflow/react';
import type { TwinEdgeData } from '@/lib/digital-twin/types';

const KIND_STROKE: Record<string, string> = {
  flow:       '#3b82f6',
  handoff:    '#a855f7',
  dependency: '#f59e0b',
  semantic:   '#14b8a6',
};

function TwinEdgeInner({
  id, sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition, data, selected,
}: EdgeProps) {
  const d = (data ?? {}) as TwinEdgeData;
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX, sourceY, targetX, targetY,
    sourcePosition, targetPosition,
  });

  const stroke = KIND_STROKE[d.kind] ?? KIND_STROKE.flow;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke,
          strokeWidth: selected ? 3 : 1.75,
          strokeDasharray: d.kind === 'semantic' ? '4 4' : undefined,
        }}
        markerEnd={`url(#twin-arrow-${d.kind ?? 'flow'})`}
      />
      {d.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-[10px] text-slate-300 whitespace-nowrap"
          >
            {d.label}
            {d.volume != null && (
              <span className="ml-1 text-slate-500 font-mono">{d.volume}</span>
            )}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export const TwinEdge = memo(TwinEdgeInner);
export default TwinEdge;
