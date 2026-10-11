'use client';
import * as React from 'react';
export interface BomAlternate { id: string; hsCode: string; description: string; deltaCost: number; deltaOrigin?: string; }
export interface BomAlternateListProps { items?: BomAlternate[]; currency?: string; onSelect?: (i: BomAlternate) => void; }
export function BomAlternateList({ items = [], currency = 'MYR', onSelect }: BomAlternateListProps) {
  if (!items.length) return <div className="p-4 text-center text-xs text-slate-500">No alternates.</div>;
  return (
    <ul className="divide-y rounded-lg border bg-white">
      {items.map((i) => (
        <li key={i.id} onClick={() => onSelect?.(i)} className="flex cursor-pointer items-center gap-3 p-2 text-xs hover:bg-slate-50">
          <span className="font-mono">{i.hsCode}</span>
          <span className="flex-1 truncate">{i.description}</span>
          <span className={'font-mono ' + (i.deltaCost < 0 ? 'text-emerald-700' : i.deltaCost > 0 ? 'text-red-700' : 'text-slate-400')}>{i.deltaCost > 0 ? '+' : ''}{currency} {i.deltaCost}</span>
        </li>
      ))}
    </ul>
  );
}
export default BomAlternateList;
