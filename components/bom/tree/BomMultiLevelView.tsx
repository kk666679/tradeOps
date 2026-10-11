'use client';
import * as React from 'react';
export interface BomMultiLevelViewProps { levels?: number; className?: string; }
export function BomMultiLevelView({ levels = 3, className }: BomMultiLevelViewProps) {
  return (
    <div className={className ?? 'rounded-lg border bg-white p-4'}>
      <div className="mb-2 text-xs uppercase text-slate-500">Multi-level BOM · {levels} levels</div>
      <div className="space-y-1">
        {Array.from({ length: levels }).map((_, i) => (
          <div key={i} className="rounded border bg-slate-50 p-2 text-xs" style={{ marginLeft: (i * 20) + 'px' }}>
            Level {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
export default BomMultiLevelView;
