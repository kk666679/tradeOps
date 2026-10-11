'use client';
import * as React from 'react';
import { BomApprovalCard } from './BomApprovalCard';
export interface BomApprovalItem { id: string; ref: string; submittedBy: string; at: string; }
export interface BomApprovalQueueProps { items?: BomApprovalItem[]; onApprove?: (id: string) => void; onReject?: (id: string) => void; }
export function BomApprovalQueue({ items = [], onApprove, onReject }: BomApprovalQueueProps) {
  if (!items.length) return <div className="p-4 text-center text-xs text-slate-500">No pending approvals.</div>;
  return <ul className="space-y-2">{items.map((i) => <BomApprovalCard key={i.id} item={i} onApprove={onApprove} onReject={onReject} />)}</ul>;
}
export default BomApprovalQueue;
