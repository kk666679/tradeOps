'use client';
import { useLayoutEffect, useRef } from 'react';
import type { GraphNode, NodeDef } from '@/lib/workflow-studio/types';
import { NODE_WIDTH, STATUS_COLOR, STATUS_TEXT } from '@/lib/workflow-studio/constants';
import { HS_BY_CODE } from '@/lib/workflow-studio/hs-catalog';

interface Props {
  node: GraphNode;
  def?: NodeDef;
  selected: boolean;
  dragging: boolean;
  hotPort: boolean;
  onMouseDown: (e: React.MouseEvent, id: string) => void;
  onContextMenu: (e: React.MouseEvent, id: string) => void;
  onMeasure: (id: string, h: number) => void;
  onStartLink: (e: React.MouseEvent, id: string) => void;
  onPortEnter: (id: string) => void;
  onPortLeave: (id: string) => void;
  onOpenPicker: (id: string) => void;
}

export function NodeCard({
  node, def, selected, dragging, hotPort,
  onMouseDown, onContextMenu, onMeasure, onStartLink,
  onPortEnter, onPortLeave, onOpenPicker,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => onMeasure(node.id, el.getBoundingClientRect().height);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [node.id, onMeasure, node.error, node.ref, node.status,
      node.provenance, node.hsCode, node.pgaLicense]);

  const statusColor = STATUS_COLOR[node.status] || STATUS_COLOR.idle;
  const hsEntry = node.hsCode ? HS_BY_CODE[node.hsCode] : null;
  const isRestricted = !!hsEntry?.restricted;

  return (
    <div
      ref={ref}
      data-node-id={node.id}
      className={'bws-node' + (selected ? ' selected' : '') + (dragging ? ' dragging' : '')}
      data-status={node.status}
      style={{ left: node.x, top: node.y, width: NODE_WIDTH, borderColor: statusColor }}
      onMouseDown={(e) => onMouseDown(e, node.id)}
      onContextMenu={(e) => onContextMenu(e, node.id)}
    >
      <div
        className={'bws-port target' + (hotPort ? ' hot' : '')}
        data-port="target"
        title="Drop a connection here"
        onMouseEnter={() => onPortEnter(node.id)}
        onMouseLeave={() => onPortLeave(node.id)}
      />

      <div className="bws-node-op">
        <span>{def?.op || node.type}</span>
        {node.provenance === 'synthetic' && <span className="bws-chip s">synthetic</span>}
        {node.provenance === 'manual' && <span className="bws-chip m">manual</span>}
        {node.provenance === 'verified' && <span className="bws-chip v">verified</span>}
        {node.status === 'blocked' && <span className="bws-chip e">blocked</span>}
        {def?.human && <span className="bws-chip l">approval</span>}
      </div>

      <div className="bws-node-label">{def?.label || node.type}</div>

      {node.hsCode && (
        <div
          className={'bws-hs-chip' + (isRestricted ? ' restricted' : '')}
          onClick={(e) => { e.stopPropagation(); onOpenPicker(node.id); }}
          title="Click to change HS code"
          style={{ cursor: 'pointer' }}
        >
          <span style={{ fontWeight: 700 }}>{node.hsCode}</span>
          <span className="rates">
            {hsEntry ? `${hsEntry.duty}% duty · ${hsEntry.sst}% SST` : 'unverified'}
          </span>
        </div>
      )}

      {node.ref && <div className="bws-node-muted">ref: {node.ref}</div>}
      {node.error && <div className="bws-node-err">{node.error}</div>}

      <div className="bws-node-foot" style={{ color: statusColor }}>
        <span className="d" />
        <span style={{ color: 'var(--bws-muted)' }}>{STATUS_TEXT[node.status] || 'Idle'}</span>
        {def?.sideEffect && (
          <span style={{ marginLeft: 'auto', color: '#fca5a5' }}>side-effect</span>
        )}
      </div>

      <div
        className="bws-port source"
        data-port="source"
        title="Drag to connect"
        onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); onStartLink(e, node.id); }}
      />
    </div>
  );
}
