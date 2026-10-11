'use client';
import * as React from 'react';
export interface BomTopComponent { hsCode: string; description: string; uses: number; }
export interface BomTopComponentsListProps { items?: BomTopComponent[]; }
export function BomTopComponentsList({ items = [] }: BomTopComponentsListProps) {
  if (!items.length) return <div className="p-4 text-center text-xs text-slate-500">No data.</div>;
  return (
    <ul className="divide-y rounded-lg border bg-white">
      {items.map((i) => (
        <li key={i.hsCode} className="flex items-center gap-3 p-2 text-xs">
          <span className="font-mono">{i.hsCode}</span>
          <span className="flex-1 truncate">{i.description}</span>
          <span className="font-mono">{i.uses}</span>
        </li>
      ))}
    </ul>
  );
}
export default BomTopComponentsList;
