'use client';
import * as React from 'react';
export interface BomComponentPickerItem { id: string; hsCode: string; description: string; uom: string; }
export interface BomComponentPickerProps { items?: BomComponentPickerItem[]; onPick?: (it: BomComponentPickerItem) => void; placeholder?: string; }
export function BomComponentPicker({ items = [], onPick, placeholder = 'Search HS or description…' }: BomComponentPickerProps) {
  const [q, setQ] = React.useState('');
  const filtered = items.filter((i) => (i.hsCode + ' ' + i.description).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="rounded-lg border bg-white">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} className="w-full border-b px-3 py-2 text-sm outline-none" />
      <ul className="max-h-64 divide-y overflow-auto">
        {filtered.slice(0, 20).map((i) => (
          <li key={i.id} onClick={() => onPick?.(i)} className="cursor-pointer p-2 text-xs hover:bg-slate-50">
            <div className="font-mono">{i.hsCode}</div>
            <div className="text-slate-500">{i.description} · {i.uom}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default BomComponentPicker;
