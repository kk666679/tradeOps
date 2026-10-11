'use client';
import * as React from 'react';
export interface BomWhereUsedRow { id: string; bomRef: string; outputHs: string; qtyPer: number; }
export interface BomWhereUsedListProps { rows?: BomWhereUsedRow[]; onSelect?: (r: BomWhereUsedRow) => void; }
export function BomWhereUsedList({ rows = [], onSelect }: BomWhereUsedListProps) {
  if (!rows.length) return <div className="p-4 text-center text-xs text-slate-500">Not used in any BOM.</div>;
  return (
    <ul className="divide-y rounded-lg border bg-white">
      {rows.map((r) => (
        <li key={r.id} onClick={() => onSelect?.(r)} className="flex cursor-pointer items-center gap-3 p-2 text-xs hover:bg-slate-50">
          <span className="font-mono">{r.bomRef}</span>
          <span className="font-mono text-slate-500">{r.outputHs}</span>
          <span className="ml-auto font-mono">{r.qtyPer}</span>
        </li>
      ))}
    </ul>
  );
}
export default BomWhereUsedList;
