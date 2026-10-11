'use client';
import * as React from 'react';
export interface BomFtaEligibilityProps { scheme: 'ATIGA' | 'RCEP' | 'FTA' | 'NONE'; threshold: number; actual: number; }
export function BomFtaEligibility({ scheme, threshold, actual }: BomFtaEligibilityProps) {
  const ok = actual >= threshold;
  return (
    <div className={'rounded-lg border p-4 ' + (ok ? 'border-emerald-200 bg-emerald-50/40' : 'border-amber-200 bg-amber-50/40')}>
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">{scheme}</div>
        <span className={'rounded-full px-2 py-0.5 text-[10px] font-medium ' + (ok ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800')}>{ok ? 'ELIGIBLE' : 'NOT MET'}</span>
      </div>
      <div className="mt-2 text-xs text-slate-600">Local content: <span className="font-mono font-semibold">{actual}%</span> / threshold <span className="font-mono">{threshold}%</span></div>
    </div>
  );
}
export default BomFtaEligibility;
