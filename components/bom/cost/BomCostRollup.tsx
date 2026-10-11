'use client';
import * as React from 'react';
export interface BomCostRollupProps {
  material: number;
  labour: number;
  overhead: number;
  duty: number;
  tax: number;
  currency?: string;
}
export function BomCostRollup({ material, labour, overhead, duty, tax, currency = 'MYR' }: BomCostRollupProps) {
  const total = material + labour + overhead + duty + tax;
  const rows = [['Material', material], ['Labour', labour], ['Overhead', overhead], ['Duty', duty], ['Tax', tax]] as const;
  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Cost rollup</div>
        <div className="text-lg font-semibold">{currency + ' ' + total.toLocaleString()}</div>
      </div>
      <table className="mt-3 w-full text-xs">
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k} className="border-b last:border-0">
              <td className="py-1 text-slate-500">{k}</td>
              <td className="py-1 text-right font-mono">{currency} {v.toLocaleString()}</td>
              <td className="py-1 text-right text-slate-400">{((v / Math.max(1, total)) * 100).toFixed(0)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default BomCostRollup;
