'use client';
import * as React from 'react';
export interface BomApprovalCardItem { id: string; ref: string; submittedBy: string; at: string; }
export interface BomApprovalCardProps { item: BomApprovalCardItem; onApprove?: (id: string) => void; onReject?: (id: string) => void; }
export function BomApprovalCard({ item, onApprove, onReject }: BomApprovalCardProps) {
  return (
    <li className="flex items-center justify-between rounded-lg border bg-white p-3 text-sm">
      <div>
        <div className="font-mono">{item.ref}</div>
        <div className="text-xs text-slate-500">{item.submittedBy} · {item.at}</div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onApprove?.(item.id)} className="rounded bg-slate-900 px-3 py-1 text-xs font-medium text-white">Approve</button>
        <button onClick={() => onReject?.(item.id)} className="rounded border px-3 py-1 text-xs">Reject</button>
      </div>
    </li>
  );
}
export default BomApprovalCard;
