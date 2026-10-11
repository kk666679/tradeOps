'use client';
import * as React from 'react';
export interface BomRevision { id: string; version: string; at: string; author: string; note?: string; current?: boolean; }
export interface BomRevisionListProps { revisions?: BomRevision[]; onSelect?: (r: BomRevision) => void; }
export function BomRevisionList({ revisions = [], onSelect }: BomRevisionListProps) {
  if (!revisions.length) return <div className="p-4 text-center text-xs text-slate-500">No revisions.</div>;
  return (
    <ul className="divide-y rounded-lg border bg-white">
      {revisions.map((r) => (
        <li key={r.id} onClick={() => onSelect?.(r)} className="flex cursor-pointer items-center gap-2 p-2 text-xs hover:bg-slate-50">
          <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono">{r.version}</span>
          <span className="text-slate-500">{r.at} · {r.author}</span>
          {r.current ? <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] text-emerald-800">current</span> : null}
          <span className="ml-auto truncate text-slate-400">{r.note ?? ''}</span>
        </li>
      ))}
    </ul>
  );
}
export default BomRevisionList;
