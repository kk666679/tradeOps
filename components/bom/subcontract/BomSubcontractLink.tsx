'use client';
import * as React from 'react';
export interface BomSubcontractLinkProps { subcontractRef?: string; parentBomRef?: string; onUnlink?: () => void; }
export function BomSubcontractLink({ subcontractRef, parentBomRef, onUnlink }: BomSubcontractLinkProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg border bg-white p-2 text-xs">
      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">Subcontract</span>
      <span className="font-mono">{subcontractRef ?? '—'}</span>
      <span className="text-slate-400">←</span>
      <span className="font-mono">{parentBomRef ?? '—'}</span>
      {onUnlink ? <button onClick={onUnlink} className="ml-auto rounded border px-2 py-0.5 text-[10px]">Unlink</button> : null}
    </div>
  );
}
export default BomSubcontractLink;
