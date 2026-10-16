'use client';

import type { StudioEdge, StudioNode } from '@/types';
import { PROV_COLOR } from '@/constants/palettes';

export interface EdgePanelProps {
  edge: StudioEdge | undefined;
  nodeById: Map<string, StudioNode>;
  onDelete: () => void;
}

export default function EdgePanel({ edge, nodeById, onDelete }: EdgePanelProps) {
  if (!edge) {
    return (
      <div className="flex-1 overflow-y-auto p-2.5">
        <p className="text-[10.5px] text-[#4b5563]">Select an edge on the canvas to inspect it.</p>
      </div>
    );
  }

  const prov = edge.data?.provenance ?? 'pending';

  return (
    <div className="flex-1 overflow-y-auto p-2.5">
      <div className="mb-2 rounded-lg border border-[#1f2937] bg-[#0f1830] p-2.5">
        <h5 className="mb-2 text-[9.5px] font-extrabold uppercase tracking-widest text-[#4b5563]">Edge</h5>
        <KV k="ID" v={edge.id} />
        <KV k="Source" v={nodeById.get(edge.source)?.data.label || edge.source} />
        <KV k="Source handle" v={edge.sourceHandle || 'out'} />
        <KV k="Target" v={nodeById.get(edge.target)?.data.label || edge.target} />
        <KV k="Type" v={edge.type || 'default'} />
        <KV k="Provenance" v={prov} />
        <KV k="Loop-back" v={edge.data?.isLoop ? 'yes ⟲' : 'no'} />
        <div className="mt-2.5 flex gap-1.5">
          <button onClick={onDelete}
            className="flex-1 rounded border border-[#2d3748] bg-[#131921] px-2 py-1 text-[10px] font-semibold hover:bg-[#1f2731]">
            Delete edge
          </button>
        </div>
      </div>
    </div>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-2 py-1 text-[11px]">
      <span className="text-[#6b7280]">{k}</span>
      <span className="text-right font-semibold break-words">{v}</span>
    </div>
  );
}