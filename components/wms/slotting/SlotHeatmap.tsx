'use client';
import * as React from 'react';
export interface SlotHeatmapPoint { x: string | number; y: number; }
export interface SlotHeatmapProps { data?: SlotHeatmapPoint[]; height?: number; }
export function SlotHeatmap({ data = [], height = 220 }: SlotHeatmapProps) {
  const max = Math.max(1, ...data.map((d) => d.y));
  return (
    <div className="w-full" style={{ height }} role="img" aria-label="SlotHeatmap">
      {data.length === 0 ? (
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No data</div>
      ) : (
        <div className="flex h-full items-end gap-1">
          {data.map((d, i) => (
            <div key={i} className="flex-1 rounded-t bg-primary/70" style={{ height: `${(d.y / max) * 100}%` }} title={`${d.x}: ${d.y}`} />
          ))}
        </div>
      )}
    </div>
  );
}
export default SlotHeatmap;
