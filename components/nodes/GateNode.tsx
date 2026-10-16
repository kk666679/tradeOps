'use client';

import { Handle, NodeResizer, Position, type NodeProps } from '@xyflow/react';
import type { StudioNode } from '@/types';
import { STATUS_COLOR, STATUS_TEXT } from '@/constants/palettes';
import StatusChips from './StatusChips';
import NodeToolbarActions from './NodeToolbarActions';

export default function GateNode({ id, data, selected }: NodeProps<StudioNode>) {
  const statusColor = STATUS_COLOR[data.status] || STATUS_COLOR.idle;
  const untilList = (data.until || []).join(' / ');

  return (
    <>
      <NodeResizer
        isVisible={!!selected}
        minWidth={200}
        minHeight={100}
        lineStyle={{ borderColor: '#06b6d4' }}
        handleStyle={{ background: '#06b6d4', width: 7, height: 7, borderRadius: 2 }}
      />
      {selected && <NodeToolbarActions id={id} />}

      <div
        className={
          'relative w-[220px] cursor-pointer select-none rounded-lg border-[1.5px] border-dashed bg-[#131d33] px-2.5 py-[9px] shadow-md transition-[box-shadow] ' +
          (selected ? 'shadow-[0_0_0_2px_#3b82f6,0_3px_14px_rgba(0,0,0,.5)]' : '') +
          (data.status === 'running' ? ' animate-pulse' : '')
        }
        style={{ borderColor: statusColor }}>
        <Handle type="target" position={Position.Top} id="in" />

        <div className="flex flex-wrap items-center gap-1 text-[9px] font-extrabold uppercase tracking-widest text-[#4b5563]">
          <span>flow.until</span>
          <StatusChips data={data} />
        </div>

        <div className="my-1 text-[12.5px] font-semibold leading-tight text-[#e8eefb]">{data.label}</div>
        <div className="mt-0.5 text-[9px] font-bold tracking-wide text-cyan-400">
          exit when: {untilList || '—'}
        </div>
        <div className="mt-0.5 truncate font-mono text-[9.5px] text-[#6b7280]">
          max iterations: {data.maxIter}
        </div>
        {data.note && !data.error && <div className="mt-0.5 truncate font-mono text-[9.5px] text-[#6b7280]">{data.note}</div>}
        {data.error && <div className="mt-1 text-[9.5px] leading-tight text-[#fca5a5]">{data.error}</div>}

        <div className="mt-1.5 flex items-center gap-1.5 text-[9.5px] font-semibold" style={{ color: statusColor }}>
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          <span className="text-[#6b7280]">{STATUS_TEXT[data.status] || 'Idle'}</span>
        </div>

        <div className="pointer-events-none mt-2 flex justify-between text-[8.5px] font-extrabold uppercase tracking-wider text-[#4b5563]">
          <span>pass ↓</span>
          <span>loop ↻</span>
        </div>

        <Handle type="source" position={Position.Bottom} id="pass" style={{ left: '30%' }} />
        <Handle type="source" position={Position.Right} id="loop" />
      </div>
    </>
  );
}