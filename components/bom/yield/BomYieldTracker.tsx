'use client';
import * as React from 'react';
export interface BomYieldTrackerProps { planned: number; produced: number; uom?: string; }
export function BomYieldTracker({ planned, produced, uom = 'EA' }: BomYieldTrackerProps) {
  const pct = planned > 0 ? Math.min(100, Math.round((produced / planned) * 100)) : 0;
  const tone = pct < 80 ? 'bg-red-500' : pct < 95 ? 'bg-amber-500' : 'bg-emerald-500';
  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="flex items-center justify-between text-xs"><span className="text-slate-500">Yield</span><span className="font-mono">{produced} / {planned} {uom}</span></div>
      <div className="mt-2 h-2 w-full rounded bg-slate-100"><div className={'h-2 rounded ' + tone} style={{ width: pct + '%' }} /></div>
      <div className="mt-1 text-xs text-slate-500">{pct}% of planned</div>
    </div>
  );
}
export default BomYieldTracker;
