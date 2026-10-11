'use client';
import * as React from 'react';

export interface BomListRow {
  id: string;
  ref: string;
  output?: string;
  version?: string;
  status?: string;
  meta?: string;
}
export interface BomListProps {
  rows?: BomListRow[];
  empty?: string;
  onSelect?: (r: BomListRow) => void;
}

export function BomList({ rows = [], empty = 'No BOMs', onSelect }: BomListProps) {
  if (!rows.length) return <div className="p-6 text-center text-xs text-slate-500">{empty}</div>;
  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="p-3 text-left">Ref</th>
            <th className="p-3 text-left">Output HS</th>
            <th className="p-3 text-left">Version</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Meta</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} onClick={() => onSelect?.(r)} className="cursor-pointer border-b last:border-0 hover:bg-slate-50">
              <td className="p-3 font-mono text-xs">{r.ref}</td>
              <td className="p-3 font-mono text-xs">{r.output ?? '—'}</td>
              <td className="p-3 text-xs">{r.version ?? '—'}</td>
              <td className="p-3"><span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px]">{r.status ?? 'DRAFT'}</span></td>
              <td className="p-3 text-xs text-slate-500">{r.meta ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default BomList;
