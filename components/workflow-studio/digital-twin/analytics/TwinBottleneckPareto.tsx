'use client';
import * as React from 'react';
export interface TwinBottleneckParetoPoint { x: string | number; y: number; zone?: 'FIZ' | 'FCZ'; }
export interface TwinBottleneckParetoProps { data?: TwinBottleneckParetoPoint[]; height?: number; }
export function TwinBottleneckPareto({ data = [], height = 220 }: TwinBottleneckParetoProps) {
  const max = Math.max(1, ...data.map((d) => d.y));
  return (
    <div className="w-full" style={{ height }} role="img" aria-label="TwinBottleneckPareto">
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
export default TwinBottleneckPareto;
