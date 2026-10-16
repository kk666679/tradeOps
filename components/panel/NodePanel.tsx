'use client';

import type { StudioNode } from '@/types';

export interface NodePanelProps {
  node: StudioNode | undefined;
  onDuplicate: () => void;
  onDelete: () => void;
}

export default function NodePanel({ node, onDuplicate, onDelete }: NodePanelProps) {
  if (!node) {
    return (
      <div className="flex-1 overflow-y-auto p-2.5">
        <p className="text-[10.5px] text-[#4b5563]">Select a node on the canvas to inspect its contract.</p>
      </div>
    );
  }

  const d = node.data;

  return (
    <div className="flex-1 overflow-y-auto p-2.5">
      <Card title="Node Contract">
        <KV k="Type" v={d.libraryType} />
        <KV k="Operation" v={d.op} />
        <KV k="Required capability" v={d.requires || 'local operation'} />
        <KV k="Kind" v={d.kind} />
        <KV k="Human approval" v={d.human ? 'required' : 'not required'} />
        <KV k="External side-effect" v={d.sideEffect ? 'yes' : 'no'}
          vCls={d.sideEffect ? 'text-[#fca5a5]' : 'text-emerald-300'} />
        <KV k="Status" v={d.status} />
        <KV k="Provenance" v={d.provenance} />
        {d.kind === 'gate' && (
          <>
            <KV k="Loop until" v={(d.until || []).join(', ')} />
            <KV k="Max iterations" v={String(d.maxIter)} />
            <KV k="Iterations run" v={String(d.iterations || 0)} />
          </>
        )}
      </Card>

      <Card title="Last Result">
        <KV k="External ref" v={d.ref || 'none'} />
        {d.note && <div className="mt-1.5 text-[10.5px] text-[#4b5563]">{d.note}</div>}
        {d.error && (
          <div className="mt-2 rounded border border-[#5b1a1a] bg-[#2a0d0d] p-2 text-[10.5px] text-[#fca5a5]">
            {d.error}
          </div>
        )}
      </Card>

      <div className="flex flex-wrap gap-1.5">
        <button onClick={onDuplicate}
          className="flex-1 rounded border border-[#2d3748] bg-[#131921] px-2 py-1 text-[10px] font-semibold hover:bg-[#1f2731]">
          Duplicate
        </button>
        <button onClick={onDelete}
          className="flex-1 rounded border border-[#2d3748] bg-[#131921] px-2 py-1 text-[10px] font-semibold hover:bg-[#1f2731]">
          Delete node
        </button>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-2 rounded-lg border border-[#1f2937] bg-[#0f1830] p-2.5">
      <h5 className="mb-2 text-[9.5px] font-extrabold uppercase tracking-widest text-[#4b5563]">{title}</h5>
      {children}
    </div>
  );
}

function KV({ k, v, vCls }: { k: string; v: string; vCls?: string }) {
  return (
    <div className="flex justify-between gap-2 py-1 text-[11px]">
      <span className="text-[#6b7280]">{k}</span>
      <span className={'text-right font-semibold break-words ' + (vCls || '')}>{v}</span>
    </div>
  );
}