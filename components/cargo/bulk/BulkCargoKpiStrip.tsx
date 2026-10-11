'use client';
import * as React from 'react';
export interface BulkCargoKpiStripItem { label: string; value: React.ReactNode; hint?: string; }
export interface BulkCargoKpiStripProps { items?: BulkCargoKpiStripItem[]; }
export function BulkCargoKpiStrip({ items = [] }: BulkCargoKpiStripProps) {
  const defaults = ['Throughput', 'Queue', 'Dwell', 'Alerts'];
  const rows = items.length ? items : defaults.map((l) => ({ label: l, value: '—', hint: undefined }));
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {rows.map((i, k) => (
        <div key={k} className="rounded border p-3">
          <div className="text-xs text-muted-foreground">{i.label}</div>
          <div className="text-lg FontSemibold">{i.value}</div>
          {i.hint ? <div className="text-xs text-muted-foreground">{i.hint}</div> : null}
        </div>
      ))}
    </div>
  );
}
export default BulkCargoKpiStrip;
