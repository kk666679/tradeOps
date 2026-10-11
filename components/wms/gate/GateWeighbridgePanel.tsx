'use client';
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
export interface GateWeighbridgePanelReading { vehicle: string; grossKg: number; tareKg: number; at: string; }
export interface GateWeighbridgePanelProps { readings?: GateWeighbridgePanelReading[]; }
export function GateWeighbridgePanel({ readings = [] }: GateWeighbridgePanelProps) {
  return (
    <Card>
      <CardHeader><CardTitle>Weighbridge</CardTitle></CardHeader>
      <CardContent className="space-y-1 text-sm">
        {readings.length === 0 ? <p className="text-xs text-muted-foreground">No readings</p> :
          readings.map((r, i) => (
            <div key={i} className="flex justify-between border-b py-1 last:border-0">
              <span className="font-mono">{r.vehicle}</span>
              <span>{(r.grossKg - r.tareKg).toFixed(0)} kg net</span>
              <span className="text-xs text-muted-foreground">{r.at}</span>
            </div>
          ))}
      </CardContent>
    </Card>
  );
}
export default GateWeighbridgePanel;
