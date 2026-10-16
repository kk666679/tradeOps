'use client';

import { useLayoutEffect, useRef } from 'react';
import type { GraphNode } from '@/types';
import { byType } from '@/constants/nodeLibrary';
import { STATUS_COLOR, STATUS_TEXT } from '@/constants/palettes';

interface NodeCardProps {
  node: GraphNode;
  selected: boolean;
  onSelect: (id: string) => void;
  onMeasure: (id: string, h: number) => void;
  onStartWire: (e: React.PointerEvent, id: string, port: number) => void;
}

export function NodeCard({ node, selected, onSelect, onMeasure, onStartWire }: NodeCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const def = byType[node.type];

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => onMeasure(node.id, el.getBoundingClientRect().height);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [node.id, onMeasure, node.status, node.ref, node.error, node.provenance]);

  const statusColor = STATUS_COLOR[node.status] || STATUS_COLOR.idle;
  const outCount = def?.out ?? 1;
  const isGate = def?.kind === 'gate';

  return (
    <div
      ref={ref}
      className={'node' + (selected ? ' selected' : '')}
      data-status={node.status}
      style={{ left: node.x, top: node.y, borderColor: statusColor }}
      onClick={(e) => { e.stopPropagation(); onSelect(node.id); }}
    >
      {def?.out !== 0 && <span className="port in" title="input" />}

      <div className="op">
        <span>{def?.op || node.type}</span>
        {node.provenance === 'synthetic' && <span className="chip s">synthetic</span>}
        {node.provenance === 'manual' && <span className="chip m">manual</span>}
        {node.provenance === 'verified' && <span className="chip v">verified</span>}
        {(node.status === 'blocked' || node.provenance === 'blocked') && <span className="chip e">blocked</span>}
        {def?.human && <span className="chip l">approval</span>}
        {isGate && node.iterations > 0 && <span className="chip loop">⟲ {node.iterations}</span>}
      </div>

      <div className="label">{def?.label || node.type}</div>
      {node.ref && <div className="muted">ref: {node.ref}</div>}
      {node.note && !node.error && <div className="muted">{node.note}</div>}
      {node.error && <div className="err">{node.error}</div>}

      <div className="foot" style={{ color: statusColor }}>
        <span className="d" />
        <span className="text-[#6b7280]">{STATUS_TEXT[node.status] || 'Idle'}</span>
        {def?.sideEffect && <span className="ml-auto text-[#fca5a5]">side-effect</span>}
      </div>

      {outCount > 0 && (
        <>
          {outCount === 1 && (
            <span className="port out o0" title="output"
              onPointerDown={(e) => onStartWire(e, node.id, 0)} />
          )}
          {outCount === 2 && (
            <>
              <span className="port out ol" title="output · pass"
                onPointerDown={(e) => onStartWire(e, node.id, 0)} />
              <span className="port-tag" style={{ left: '14%' }}>pass</span>
              <span className="port out or" title="output · loop back"
                onPointerDown={(e) => onStartWire(e, node.id, 1)} />
              <span className="port-tag" style={{ right: '8%' }}>loop</span>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default NodeCard;