'use client';
import * as React from 'react';
export interface BomKpiItem { label: string; value: React.ReactNode; hint?: string; }
export interface BomKpiStripProps { items?: BomKpiItem[]; }
const DEFAULTS: BomKpiItem[] = [
  { label: 'Active BOMs', value: '0' },
  { label: 'Components', value: '0' },
  { label: 'Cost rollup', value: 'MYR 0' },
  { label: 'Origin mix', value: 'MY 0%' },
];
export function BomKpiStrip({ items = DEFAULTS }: BomKpiStripProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {items.map((i, k) => (
        <div key={k} className="rounded-lg border bg-white p-3">
          <div className="text-xs text-slate-500">{i.label}</div>
          <div className="mt-1 text-lg font-semibold">{i.value}</div>
          {i.hint ? <div className="text-xs text-slate-400">{i.hint}</div> : null}
        </div>
      ))}
    </div>
  );
}
export default BomKpiStrip;
