'use client';

import { Handle, NodeResizer, Position, type NodeProps } from '@xyflow/react';
import type { StudioNode } from '@/types';
import { STATUS_COLOR, STATUS_TEXT } from '@/constants/palettes';
import StatusChips from './StatusChips';
import NodeToolbarActions from './NodeToolbarActions';

export default function TaskNode({ id, data, selected }: NodeProps<StudioNode>) {
  const statusColor = STATUS_COLOR[data.status] || STATUS_COLOR.idle;

  return (
    <>
      <NodeResizer
        isVisible={!!selected}
        minWidth={180}
        minHeight={68}
        lineStyle={{ borderColor: 'var(--color-blue, #3b82f6)' }}
        handleStyle={{ background: 'var(--color-blue, #3b82f6)', width: 7, height: 7, borderRadius: 2 }}
      />
      {selected && <NodeToolbarActions id={id} />}

      <div
        className={
          'relative w-[220px] cursor-pointer select-none rounded-lg border-[1.5px] bg-[#131d33] px-2.5 py-[9px] shadow-md transition-[box-shadow,border-color] duration-150 ' +
          (selected ? 'shadow-[0_0_0_2px_#3b82f6,0_3px_14px_rgba(0,0,0,.5)]' : '') +
          (data.status === 'running' ? ' animate-pulse' : '')
        }
        style={{ borderColor: statusColor }}>
        <Handle type="target" position={Position.Top} id="in" />

        <div className="flex flex-wrap items-center gap-1 text-[9px] font-extrabold uppercase tracking-widest text-[#4b5563]">
          <span>{data.op}</span>
          <StatusChips data={data} />
        </div>

        <div className="my-1 text-[12.5px] font-semibold leading-tight text-[#e8eefb] break-words">
          {data.label}
        </div>
        {data.ref && <div className="mt-0.5 truncate font-mono text-[9.5px] text-[#6b7280]">ref: {data.ref}</div>}
        {data.note && !data.error && <div className="mt-0.5 truncate font-mono text-[9.5px] text-[#6b7280]">{data.note}</div>}
        {data.error && <div className="mt-1 text-[9.5px] leading-tight text-[#fca5a5]">{data.error}</div>}

        <div className="mt-1.5 flex items-center gap-1.5 text-[9.5px] font-semibold" style={{ color: statusColor }}>
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          <span className="text-[#6b7280]">{STATUS_TEXT[data.status] || 'Idle'}</span>
          {data.sideEffect && <span className="ml-auto text-[#fca5a5]">side-effect</span>}
        </div>

        <Handle type="source" position={Position.Bottom} id="out" />
      </div>
    </>
  );
}