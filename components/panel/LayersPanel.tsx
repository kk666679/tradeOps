'use client';

import type { StudioNode } from '@/types';
import { STATUS_COLOR } from '@/constants/palettes';

export interface LayersPanelProps {
  nodes: StudioNode[];
  nodeById: Map<string, StudioNode>;
  loopGroups: string[][];
  blockedNodes: StudioNode[];
  selectedNode: string | null;
  onSelectNode: (id: string) => void;
}

export default function LayersPanel(props: LayersPanelProps) {
  const { nodes, nodeById, loopGroups, blockedNodes, selectedNode, onSelectNode } = props;

  return (
    <>
      <div className="border-b border-[#1f2937] p-2.5">
        <div className="mb-1.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">
          <span>Loop groups</span>
          <span className="text-cyan-500">{loopGroups.length}</span>
        </div>
        {loopGroups.length === 0 && <div className="text-[10.5px] text-[#4b5563]">No cycles in the graph.</div>}
        {loopGroups.map((scc, i) => (
          <div key={i} className="mb-1.5 rounded border border-[#1f2937] bg-[#0f1830] p-2">
            <div className="text-[11px] font-semibold text-cyan-300">⟲ Loop group #{i + 1}</div>
            <div className="mt-1 text-[10.5px] text-[#4b5563]">
              {scc.map((id) => nodeById.get(id)?.data.label || id).join(' ⇄ ')}
            </div>
          </div>
        ))}
      </div>

      <div className="border-b border-[#1f2937] p-2.5">
        <div className="mb-1.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">
          <span>Node summary</span>
        </div>
        {nodes.map((n) => (
          <div key={n.id} onClick={() => onSelectNode(n.id)}
            className={
              'flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 ' +
              (selectedNode === n.id ? 'bg-[#1c3a5e]' : 'hover:bg-[#1f2731]')
            }>
            <span className="h-2 w-2 flex-none rounded-full"
              style={{ background: STATUS_COLOR[n.data.status] || STATUS_COLOR.idle }} />
            <span className="flex-1 truncate text-[11px] text-[#9ca3af]">{n.data.label}</span>
            <span className="text-[9px] text-[#4b5563]">{n.data.status}</span>
          </div>
        ))}
      </div>

      <div className="border-b border-[#1f2937] p-2.5">
        <div className="mb-1.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">
          <span>Blocked</span>
          <span className="text-[#fca5a5]">{blockedNodes.length}</span>
        </div>
        {blockedNodes.length === 0 && <div className="text-[10.5px] text-[#4b5563]">Nothing blocked.</div>}
        {blockedNodes.map((n) => (
          <div key={n.id} className="mb-1.5 text-[10.5px]">
            <div className="font-semibold text-[#fcd34d]">{n.data.label}</div>
            <div className="mt-0.5 text-[10px] text-[#4b5563]">{n.data.error}</div>
          </div>
        ))}
      </div>
    </>
  );
}