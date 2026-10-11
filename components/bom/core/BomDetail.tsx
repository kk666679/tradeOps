'use client';
import * as React from 'react';

export interface BomDetailProps { id?: string; version?: string; }

const TABS = ['Overview', 'Components', 'Cost', 'Origin', 'Yield', 'Revisions', 'Where-used'];

export function BomDetail({ id, version = 'v1.0' }: BomDetailProps) {
  const [active, setActive] = React.useState(TABS[0]);
  return (
    <div className="space-y-3 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm">{id ?? 'BomDetail'}</span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px]">{version}</span>
        </div>
      </div>
      <div className="flex gap-1 border-b">
        {TABS.map((t) => (
          <button key={t} onClick={() => setActive(t)} className={'rounded-t px-3 py-1.5 text-xs ' + (active === t ? 'border border-b-0 bg-white font-medium' : 'text-slate-500')}>{t}</button>
        ))}
      </div>
      <div className="rounded border bg-white p-4 text-sm text-slate-500">
        {active} tab content
      </div>
    </div>
  );
}
export default BomDetail;
