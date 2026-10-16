'use client';

import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { StudioNode } from '@/types';

export default function StartNode({ data, selected }: NodeProps<StudioNode>) {
  return (
    <div
      className={
        'w-[120px] rounded-lg border-[1.5px] bg-[#131d33] px-2 py-2 text-center shadow-md ' +
        (selected ? 'shadow-[0_0_0_2px_#3b82f6,0_3px_14px_rgba(0,0,0,.5)]' : '')
      }
      style={{ borderColor: '#3b82f6' }}>
      <div className="text-[11px] font-semibold text-[#e8eefb]">▶ {data.label}</div>
      <Handle type="source" position={Position.Bottom} id="out" />
    </div>
  );
}