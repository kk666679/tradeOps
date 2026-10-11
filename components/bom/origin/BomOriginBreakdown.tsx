'use client';
import * as React from 'react';
export interface BomOriginRow { hsCode: string; origin: string; qty: number; value: number; }
export interface BomOriginBreakdownProps { rows?: BomOriginRow[]; currency?: string; }
export function BomOriginBreakdown({ rows = [], currency = 'MYR' }: BomOriginBreakdownProps) {
  if (!rows.length) return <div className="p-4 text-center text-xs text-slate-500">No origin data.</div>;
  return (
    <table className="w-full text-xs">
      <thead className="bg-slate-50 uppercase text-slate-500"><tr><th className="p-2 text-left">HS</th><th className="p-2 text-left">Origin</th><th className="p-2 text-right">Qty</th><th className="p-2 text-right">Value</th></tr></thead>
      <tbody>{rows.map((r, i) => (<tr key={i} className="border-b last:border-0"><td className="p-2 font-mono">{r.hsCode}</td><td className="p-2">{r.origin}</td><td className="p-2 text-right font-mono">{r.qty}</td><td className="p-2 text-right font-mono">{currency} {r.value.toLocaleString()}</td></tr>))}</tbody>
    </table>
  );
}
export default BomOriginBreakdown;
