'use client';
import * as React from 'react';
export interface BomStatusBadgeProps { status?: 'DRAFT' | 'APPROVED' | 'ARCHIVED' | 'REVIEW' | string; }
export function BomStatusBadge({ status = 'DRAFT' }: BomStatusBadgeProps) {
  const cls =
    status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
    status === 'REVIEW' ? 'bg-amber-100 text-amber-800' :
    status === 'ARCHIVED' ? 'bg-slate-200 text-slate-700' :
    'bg-sky-100 text-sky-800';
  return <span className={'rounded-full px-2 py-0.5 text-[10px] font-medium ' + cls}>{status}</span>;
}
export default BomStatusBadge;
