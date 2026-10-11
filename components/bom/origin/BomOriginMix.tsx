'use client';
import * as React from 'react';
export interface BomOriginSlice { country: string; pct: number; }
export interface BomOriginMixProps { slices?: BomOriginSlice[]; }
export function BomOriginMix({ slices = [] }: BomOriginMixProps) {
  const total = slices.reduce((a, b) => a + b.pct, 0) || 1;
  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="text-xs uppercase text-slate-500">Origin mix</div>
      <div className="mt-2 flex h-3 w-full overflow-hidden rounded">
        {slices.map((s, i) => (
          <div key={s.country} style={{ width: (s.pct / total * 100) + '%' }} className={'h-3 ' + ['bg-sky-500','bg-amber-500','bg-emerald-500','bg-violet-500','bg-rose-500'][i % 5]} />
        ))}
      </div>
      <ul className="mt-2 space-y-1 text-xs">
        {slices.map((s, i) => (
          <li key={s.country} className="flex items-center gap-2">
            <span className={'h-2 w-2 rounded-full ' + ['bg-sky-500','bg-amber-500','bg-emerald-500','bg-violet-500','bg-rose-500'][i % 5]} />
            <span className="flex-1">{s.country}</span><span className="font-mono">{s.pct}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default BomOriginMix;
