'use client';
import * as React from 'react';
export interface BomComponentRow { id: string; line: number; hsCode: string; description: string; qtyPer: number; uom: string; origin?: string; dutyRate?: number; }
export interface BomComponentListProps { rows?: BomComponentRow[]; onSelect?: (r: BomComponentRow) => void; }
export function BomComponentList({ rows = [], onSelect }: BomComponentListProps) {
  if (!rows.length) return <div className="p-6 text-center text-xs text-slate-500">No components.</div>;
  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="p-2 text-left">#</th>
            <th className="p-2 text-left">HS</th>
            <th className="p-2 text-left">Description</th>
            <th className="p-2 text-right">Qty / unit</th>
            <th className="p-2 text-right">UoM</th>
            <th className="p-2 text-left">Origin</th>
            <th className="p-2 text-right">Duty</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} onClick={() => onSelect?.(r)} className="cursor-pointer border-b last:border-0 hover:bg-slate-50">
              <td className="p-2 text-xs text-slate-400">{r.line}</td>
              <td className="p-2 font-mono text-xs">{r.hsCode}</td>
              <td className="p-2">{r.description}</td>
              <td className="p-2 text-right font-mono text-xs">{r.qtyPer}</td>
              <td className="p-2 text-right text-xs">{r.uom}</td>
              <td className="p-2 text-xs">{r.origin ?? '—'}</td>
              <td className="p-2 text-right text-xs">{r.dutyRate != null ? r.dutyRate + '%' : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default BomComponentList;
