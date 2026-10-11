'use client';
import * as React from 'react';
export interface BomDiffRow { hsCode: string; before: number | null; after: number | null; }
export interface BomDiffViewProps { rows?: BomDiffRow[]; }
export function BomDiffView({ rows = [] }: BomDiffViewProps) {
  if (!rows.length) return <div className="p-4 text-center text-xs text-slate-500">No differences.</div>;
  return (
    <table className="w-full text-xs">
      <thead className="bg-slate-50 uppercase text-slate-500"><tr><th className="p-2 text-left">HS</th><th className="p-2 text-right">Before</th><th className="p-2 text-right">After</th><th className="p-2 text-right">Δ</th></tr></thead>
      <tbody>
        {rows.map((r) => {
          const delta = (r.after ?? 0) - (r.before ?? 0);
          const tone = delta > 0 ? 'text-emerald-700' : delta < 0 ? 'text-red-700' : 'text-slate-400';
          return (
            <tr key={r.hsCode} className="border-b last:border-0">
              <td className="p-2 font-mono">{r.hsCode}</td>
              <td className="p-2 text-right font-mono">{r.before ?? '—'}</td>
              <td className="p-2 text-right font-mono">{r.after ?? '—'}</td>
              <td className={'p-2 text-right font-mono ' + tone}>{delta > 0 ? '+' : ''}{delta}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
export default BomDiffView;
