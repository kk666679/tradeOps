'use client';
import * as React from 'react';

export interface BomCostTrendChartPoint { x: string | number; y: number; }
export interface BomCostTrendChartProps { data?: BomCostTrendChartPoint[]; height?: number; }

export function BomCostTrendChart({ data = [], height = 220 }: BomCostTrendChartProps) {
  const max = Math.max(1, ...data.map((d) => d.y));
  return (
    <div className="w-full" style={{ height }} role="img" aria-label="BomCostTrendChart chart">
      {data.length === 0 ? (
        <div className="flex h-full items-center justify-center text-xs text-slate-400">No data</div>
      ) : (
        <div className="flex h-full items-end gap-1">
          {data.map((d, i) => (
            <div key={i} className="flex-1 rounded-t bg-primary/70" style={{ height: ((d.y / max) * 100) + '%' }} title={d.x + ': ' + d.y} />
          ))}
        </div>
      )}
    </div>
  );
}
export default BomCostTrendChart;
