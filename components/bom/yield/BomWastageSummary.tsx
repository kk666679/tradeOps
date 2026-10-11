'use client';
import * as React from 'react';
export interface BomWastageItem { reason: string; qty: number; value: number; }
export interface BomWastageSummaryProps { items?: BomWastageItem[]; currency?: string; }
export function BomWastageSummary({ items = [], currency = 'MYR' }: BomWastageSummaryProps) {
  if (!items.length) return <div className="p-4 text-center text-xs text-slate-500">No wastage.</div>;
  return (
    <table className="w-full text-xs">
      <thead className="bg-slate-50 uppercase text-slate-500"><tr><th className="p-2 text-left">Reason</th><th className="p-2 text-right">Qty</th><th className="p-2 text-right">Value</th></tr></thead>
      <tbody>{items.map((it) => (<tr key={it.reason} className="border-b last:border-0"><td className="p-2">{it.reason}</td><td className="p-2 text-right font-mono">{it.qty}</td><td className="p-2 text-right font-mono">{currency} {it.value.toLocaleString()}</td></tr>))}</tbody>
    </table>
  );
}
export default BomWastageSummary;
