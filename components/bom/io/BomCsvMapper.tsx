'use client';
import * as React from 'react';
export interface BomCsvMapperProps {
  sourceColumns?: string[];
  targetColumns?: string[];
  mapping?: Record<string, string>;
  onChange?: (m: Record<string, string>) => void;
}
const DEFAULT_TARGET = ['hs_code', 'description', 'qty_per', 'uom', 'origin', 'duty_rate', 'unit_cost'];
export function BomCsvMapper({ sourceColumns = [], targetColumns = DEFAULT_TARGET, mapping = {}, onChange }: BomCsvMapperProps) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="mb-2 text-sm font-medium">Column mapping</div>
      <table className="w-full text-xs">
        <thead className="bg-slate-50 uppercase text-slate-500"><tr><th className="p-2 text-left">Source</th><th className="p-2 text-left">Target</th></tr></thead>
        <tbody>
          {sourceColumns.map((s) => (
            <tr key={s} className="border-b last:border-0">
              <td className="p-2 font-mono">{s}</td>
              <td className="p-2">
                <select value={mapping[s] ?? ''} onChange={(e) => onChange?.({ ...mapping, [s]: e.target.value })} className="w-full rounded border px-2 py-1">
                  <option value="">—</option>
                  {targetColumns.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default BomCsvMapper;
