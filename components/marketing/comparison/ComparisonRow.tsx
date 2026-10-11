import * as React from 'react';

export interface ComparisonRowProps { feature: string; us: boolean | string; them: boolean | string }

export function ComparisonRow({ feature, us, them }: ComparisonRowProps) {
  const cell = (v: boolean | string) => typeof v === 'boolean' ? (v ? '✓' : '✕') : v;
  return (
    <tr className="border-b last:border-0">
      <td className="p-3">{feature}</td>
      <td className="p-3 text-center font-medium text-emerald-700">{cell(us)}</td>
      <td className="p-3 text-center text-slate-400">{cell(them)}</td>
    </tr>
  );
}
export default ComparisonRow;
