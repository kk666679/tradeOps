'use client';
import * as React from 'react';
export interface BomScrapEntry { id: string; at: string; hsCode: string; qty: number; reason: string; }
export interface BomScrapListProps { entries?: BomScrapEntry[]; }
export function BomScrapList({ entries = [] }: BomScrapListProps) {
  if (!entries.length) return <div className="p-4 text-center text-xs text-slate-500">No scrap entries.</div>;
  return (
    <ul className="divide-y rounded-lg border bg-white">
      {entries.map((e) => (
        <li key={e.id} className="flex items-center gap-3 p-2 text-xs">
          <span className="text-slate-400">{e.at}</span>
          <span className="font-mono">{e.hsCode}</span>
          <span className="flex-1 truncate text-slate-500">{e.reason}</span>
          <span className="font-mono">{e.qty}</span>
        </li>
      ))}
    </ul>
  );
}
export default BomScrapList;
