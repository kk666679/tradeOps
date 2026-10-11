'use client';
import * as React from 'react';
export interface TwinCostBreakdownPoint { x: string | number; y: number; zone?: 'FIZ' | 'FCZ'; }
export interface TwinCostBreakdownProps { data?: TwinCostBreakdownPoint[]; height?: number; }
export function TwinCostBreakdown({ data = [], height = 220 }: TwinCostBreakdownProps) {
  const max = Math.max(1, ...data.map((d) => d.y));
  return (
    <div className="w-full" style={{ height }} role="img" aria-label="TwinCostBreakdown">
      {data.length === 0 ? (
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No data</div>
      ) : (
        <div className="flex h-full items-end gap-1">
          {data.map((d, i) => (
            <div key={i} className={'flex-1 rounded-t ' + (d.zone === 'FIZ' ? 'bg-sky-500/70' : d.zone === 'FCZ' ? 'bg-amber-500/70' : 'bg-primary/70')} style={{ height: `${(d.y / max) * 100}%` }} title={`${d.x}: ${d.y}`} />
          ))}
        </div>
      )}
    </div>
  );
}
export default TwinCostBreakdown;
