'use client';

/**
 * ReactFlow edge renderer for the digital-twin canvas.
 *
 * Renders a directed link whose stroke, width, and animation are derived
 * from the edge's `data.kind` (flow / handoff / dependency / semantic). The
 * marker id matches the `<marker>` defs declared by DigitalTwinCanvas so
 * arrowheads line up with the path.
 */

type EdgeKind = 'flow' | 'handoff' | 'dependency' | 'semantic';

interface EdgeStyle {
  color: string;
  dashed: boolean;
  opacity: number;
  label: string;
}

const STYLES: Record<EdgeKind, EdgeStyle> = {
  flow:        { color: '#3b82f6', dashed: false,  opacity: 0.95, label: 'Flow' },
  handoff:     { color: '#a855f7', dashed: true,  opacity: 0.9,  label: 'Handoff' },
  dependency:  { color: '#f59e0b', dashed: true,  opacity: 0.85, label: 'Dependency' },
  semantic:    { color: '#14b8a6', dashed: false,  opacity: 0.8,  label: 'Semantic' },
};

function getEdgeStyle(kind?: EdgeKind): EdgeStyle {
  return kind ? STYLES[kind] : STYLES.flow;
}

export function TwinEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
  selected,
  animated,
}: {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  data?: { kind?: EdgeKind; volume?: number };
  selected?: boolean;
  animated?: boolean;
}) {
  const style = getEdgeStyle(data?.kind);
  const width = Math.max(1.5, Math.min(6, (data?.volume ?? 1) / 20));
  const stroke = selected ? '#0ea5e9' : style.color;

  return (
    <g key={id}>
      <path
        d={`M ${sourceX} ${sourceY} C ${sourceX + 80} ${sourceY}, ${targetX - 80} ${targetY}, ${targetX} ${targetY}`}
        fill="none"
        stroke={stroke}
        strokeWidth={width}
        strokeDasharray={style.dashed ? '6 4' : undefined}
        opacity={selected ? 1 : style.opacity}
        className={animated ? 'twin-edge-flow' : undefined}
      />
      <circle cx={targetX} cy={targetY} r={3} fill={stroke} />
      <title>{`${style.label} · vol ${data?.volume ?? 1}`}</title>
    </g>
  );
}
export default TwinEdge;