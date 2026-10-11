'use client';
import * as React from 'react';
export interface WmsKpiStripItem { label: string; value: React.ReactNode; hint?: string; }
export interface WmsKpiStripProps { items?: WmsKpiStripItem[]; }
export function WmsKpiStrip({ items = [] }: WmsKpiStripProps) {
  const defaults = ['Open', 'In Transit', 'Held', 'SLA Breach'];
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {(items.length ? items : defaults.map((l) => ({ label: l, value: '—', hint: undefined }))).map((i, k) => (
        <div key={k} className="rounded border p-3">
          <div className="text-xs text-muted-foreground">{i.label}</div>
          <div className="text-lg font-semibold">{i.value}</div>
          {i.hint ? <div className="text-xs text-muted-foreground">{i.hint}</div> : null}
        </div>
      ))}
    </div>
  );
}
export default WmsKpiStrip;
