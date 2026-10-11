'use client';
import * as React from 'react';
export interface BomExportProps { onExport?: (format: 'csv' | 'xlsx' | 'json') => void | Promise<void>; }
export function BomExport({ onExport }: BomExportProps) {
  return (
    <div className="flex gap-2">
      <button onClick={() => void onExport?.('csv')} className="rounded-md border px-3 py-1.5 text-sm hover:bg-slate-50">Export CSV</button>
      <button onClick={() => void onExport?.('xlsx')} className="rounded-md border px-3 py-1.5 text-sm hover:bg-slate-50">Export Excel</button>
      <button onClick={() => void onExport?.('json')} className="rounded-md border px-3 py-1.5 text-sm hover:bg-slate-50">Export JSON</button>
    </div>
  );
}
export default BomExport;
