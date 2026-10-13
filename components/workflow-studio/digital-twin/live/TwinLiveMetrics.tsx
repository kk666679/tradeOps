'use client';
import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export interface LiveMetric { id: string; label: string; value: number; unit?: string; delta?: number; }

const SAMPLE: LiveMetric[] = [
  { id: 'thru',  label: 'Throughput',     value: 342,  unit: 'plt/h',  delta: 4.2 },
  { id: 'dwell', label: 'Avg Dwell',      value: 47,   unit: 'min',    delta: -2.1 },
  { id: 'util',  label: 'Dock Util',      value: 78.4, unit: '%',      delta: 1.3 },
  { id: 'exc',   label: 'Exceptions',     value: 3,    unit: '',       delta: -25 },
];

export function TwinLiveMetrics({ metrics = SAMPLE }: { metrics?: LiveMetric[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {metrics.map((m) => (
        <Card key={m.id}>
          <CardContent className="p-3">
            <div className="text-xs text-muted-foreground">{m.label}</div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-semibold tabular-nums">{m.value.toLocaleString()}</span>
              {m.unit && <span className="text-xs text-muted-foreground">{m.unit}</span>}
            </div>
            {m.delta != null && (
              <div className={`mt-0.5 text-[11px] ${m.delta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {m.delta >= 0 ? '▲' : '▼'} {Math.abs(m.delta)}%
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
export default TwinLiveMetrics;
