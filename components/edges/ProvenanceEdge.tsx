'use client';

import {
  BaseEdge, EdgeLabelRenderer, getBezierPath,
  type EdgeProps,
} from '@xyflow/react';
import type { StudioEdge } from '@/types';
import { PROV_COLOR } from '@/constants/palettes';

export default function ProvenanceEdge({
  id, sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition, data, selected, markerEnd,
}: EdgeProps<StudioEdge>) {
  const isLoop = !!data?.isLoop;
  const isBack = targetY < sourceY - 30;

  let edgePath: string;
  let labelX: number;
  let labelY: number;

  if (isBack || isLoop) {
    const bow = 180;
    edgePath =
      `M ${sourceX} ${sourceY} ` +
      `C ${sourceX + bow} ${sourceY + 60}, ${targetX + bow} ${targetY - 60}, ${targetX} ${targetY}`;
    labelX = Math.max(sourceX, targetX) + bow * 0.75;
    labelY = (sourceY + targetY) / 2;
  } else {
    [edgePath, labelX, labelY] = getBezierPath({
      sourceX, sourceY, sourcePosition,
      targetX, targetY, targetPosition,
    });
  }

  const provenance = data?.provenance ?? 'pending';
  const color = PROV_COLOR[provenance] || PROV_COLOR.pending;
  const dashed = isLoop
    || provenance === 'pending'
    || provenance === 'synthetic'
    || provenance === 'skipped';

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: color,
          strokeWidth: isLoop ? 2.4 : 2,
          strokeDasharray: dashed ? (isLoop ? '7 5' : '6 4') : undefined,
          transition: 'stroke .3s',
        }}
      />

      {selected && (
        <path d={edgePath} fill="none" stroke="#60a5fa" strokeWidth={4} opacity={0.35} />
      )}

      <EdgeLabelRenderer>
        <div
          className={
            'absolute whitespace-nowrap rounded border px-1 py-px text-[8.5px] font-extrabold uppercase tracking-wider ' +
            (isLoop
              ? 'border-[#0e7490] bg-[#0b3a4a] text-[#67e8f9]'
              : 'border-[#2d3748] bg-[#0b1220]')
          }
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            color: isLoop ? '#67e8f9' : color,
            pointerEvents: 'all',
          }}>
          {isLoop ? '⟲ loop' : provenance}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}