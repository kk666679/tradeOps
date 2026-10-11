'use client';
import * as React from 'react';
import { BomKpiStrip } from './BomKpiStrip';
export interface BomDashboardProps { zone?: 'FIZ' | 'FCZ'; className?: string; }
export function BomDashboard({ zone = 'FIZ', className }: BomDashboardProps) {
  return (
    <section className={className}>
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Bill of Materials · {zone}</h1>
      </header>
      <BomKpiStrip />
      <div className="mt-6 rounded-lg border bg-white p-6 text-sm text-slate-500">
        BOM list, tree, cost rollup, and origin mix will render here.
      </div>
    </section>
  );
}
export default BomDashboard;
