'use client';

import { NodeToolbar, Position, useReactFlow } from '@xyflow/react';
import type { Provenance, StudioNode } from '@/types';
import { uid } from '@/lib/helpers';

export interface NodeToolbarActionsProps {
  id: string;
}

export default function NodeToolbarActions({ id }: NodeToolbarActionsProps) {
  const rf = useReactFlow<StudioNode>();

  const duplicate = () => {
    const node = rf.getNode(id);
    if (!node) return;
    const newId = 'n' + uid();
    rf.addNodes({
      ...node,
      id: newId,
      position: { x: node.position.x + 40, y: node.position.y + 40 },
      selected: false,
      data: {
        ...node.data,
        status: 'idle',
        provenance: 'pending' as Provenance,
        ref: '',
        error: '',
        note: '',
        iterations: 0,
      },
    });
  };

  const del = () => rf.deleteElements({ nodes: [{ id }] });

  return (
    <NodeToolbar isVisible position={Position.Right} offset={10}>
      <div className="flex gap-1">
        <button onClick={duplicate} title="Duplicate node"
          className="grid h-[22px] w-[22px] place-items-center rounded border border-[#2d3748] bg-[#1a2129] text-[11px] font-bold text-[#9ca3af] hover:border-blue-500 hover:bg-blue-700 hover:text-white">
          ⧉
        </button>
        <button onClick={del} title="Delete node"
          className="grid h-[22px] w-[22px] place-items-center rounded border border-[#2d3748] bg-[#1a2129] text-[11px] font-bold text-[#9ca3af] hover:border-blue-500 hover:bg-blue-700 hover:text-white">
          ✕
        </button>
      </div>
    </NodeToolbar>
  );
}