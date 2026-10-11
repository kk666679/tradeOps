'use client';
import * as React from 'react';
export interface BomEffectivityWindow { id: string; from: string; to?: string; note?: string; }
export interface BomEffectivityCalendarProps { windows?: BomEffectivityWindow[]; }
export function BomEffectivityCalendar({ windows = [] }: BomEffectivityCalendarProps) {
  if (!windows.length) return <div className="p-4 text-center text-xs text-slate-500">No effectivity windows.</div>;
  return (
    <ul className="divide-y rounded-lg border bg-white">
      {windows.map((w) => (
        <li key={w.id} className="flex items-center gap-3 p-2 text-xs">
          <span className="font-mono">{w.from}</span>
          <span className="text-slate-400">→</span>
          <span className="font-mono">{w.to ?? 'open'}</span>
          <span className="ml-auto text-slate-500">{w.note ?? ''}</span>
        </li>
      ))}
    </ul>
  );
}
export default BomEffectivityCalendar;
