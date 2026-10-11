'use client';
import * as React from 'react';
export interface BomPhantom { id: string; ref: string; kind: string; children: number; }
export interface BomPhantomListProps { items?: BomPhantom[]; }
export function BomPhantomList({ items = [] }: BomPhantomListProps) {
  if (!items.length) return <div className="p-4 text-center text-xs text-slate-500">No phantom BOMs.</div>;
  return (
    <ul className="divide-y rounded-lg border bg-white">
      {items.map((i) => (
        <li key={i.id} className="flex items-center gap-3 p-2 text-xs">
          <span className="font-mono">{i.ref}</span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5">{i.kind}</span>
          <span className="ml-auto text-slate-500">{i.children} children</span>
        </li>
      ))}
    </ul>
  );
}
export default BomPhantomList;
