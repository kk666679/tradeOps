'use client';
import * as React from 'react';

export interface FeatureCompareRow { feature: string; us: boolean | string; them: boolean | string; }
export interface FeatureCompareProps { rows: FeatureCompareRow[]; }
export function FeatureCompare({ rows }: FeatureCompareProps) {
  const cell = (v: boolean | string) => typeof v === 'boolean' ? (v ? '✓' : '✕') : v;
  return (
    <table className="w-full text-sm">
      <thead className="bg-muted/40 text-xs uppercase"><tr><th className="p-2 text-left">Capability</th><th className="p-2">CFS FIZ/FCZ</th><th className="p-2">Generic WMS</th></tr></thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.feature} className="border-b last:border-0">
            <td className="p-2">{r.feature}</td>
            <td className="p-2 text-center font-medium">{cell(r.us)}</td>
            <td className="p-2 text-center text-muted-foreground">{cell(r.them)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export default FeatureCompare;
