'use client';
import * as React from 'react';
export interface BomApprovalEntry { id: string; at: string; actor: string; decision: 'APPROVED' | 'REJECTED' | 'REVIEW'; note?: string; }
export interface BomApprovalHistoryProps { entries?: BomApprovalEntry[]; }
export function BomApprovalHistory({ entries = [] }: BomApprovalHistoryProps) {
  if (!entries.length) return <div className="p-4 text-center text-xs text-slate-500">No history.</div>;
  return (
    <ul className="divide-y rounded-lg border bg-white">
      {entries.map((e) => (
        <li key={e.id} className="flex items-center gap-2 p-2 text-xs">
          <span className="text-slate-400">{e.at}</span>
          <span className="font-medium">{e.actor}</span>
          <span className={'rounded-full px-2 py-0.5 text-[10px] font-medium ' + (e.decision === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : e.decision === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800')}>{e.decision}</span>
          <span className="ml-auto truncate text-slate-400">{e.note ?? ''}</span>
        </li>
      ))}
    </ul>
  );
}
export default BomApprovalHistory;
