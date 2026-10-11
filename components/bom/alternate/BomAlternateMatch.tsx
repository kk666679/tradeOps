'use client';
import * as React from 'react';
export interface BomAlternateMatchProps { original: string; alternates?: { hsCode: string; match: number }[]; }
export function BomAlternateMatch({ original, alternates = [] }: BomAlternateMatchProps) {
  return (
    <div className="rounded-lg border bg-white p-4 text-sm">
      <div className="text-xs uppercase text-slate-500">Alternates for <span className="font-mono">{original}</span></div>
      <ul className="mt-2 space-y-1">
        {alternates.map((a) => (
          <li key={a.hsCode} className="flex items-center gap-2 text-xs">
            <span className="font-mono">{a.hsCode}</span>
            <div className="ml-auto flex items-center gap-2">
              <div className="h-1.5 w-20 rounded bg-slate-100"><div className="h-1.5 rounded bg-emerald-500" style={{ width: (a.match * 100) + '%' }} /></div>
              <span className="text-slate-500">{(a.match * 100).toFixed(0)}%</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default BomAlternateMatch;
