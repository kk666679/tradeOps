'use client';
import * as React from 'react';
export interface BomSubcontract { id: string; subcontractor: string; hsCode: string; qty: number; status: 'DRAFT' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED'; }
export interface BomSubcontractListProps { items?: BomSubcontract[]; onSelect?: (i: BomSubcontract) => void; }
export function BomSubcontractList({ items = [], onSelect }: BomSubcontractListProps) {
  if (!items.length) return <div className="p-4 text-center text-xs text-slate-500">No subcontract orders.</div>;
  return (
    <ul className="divide-y rounded-lg border bg-white">
      {items.map((i) => (
        <li key={i.id} onClick={() => onSelect?.(i)} className="flex cursor-pointer items-center gap-3 p-2 text-xs hover:bg-slate-50">
          <span className="font-mono">{i.hsCode}</span>
          <span className="flex-1 truncate">{i.subcontractor}</span>
          <span className="font-mono">{i.qty}</span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5">{i.status}</span>
        </li>
      ))}
    </ul>
  );
}
export default BomSubcontractList;
