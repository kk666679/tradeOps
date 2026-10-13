'use client';
import * as React from 'react';

export interface LiveEvent { id: string; ts: string; source: string; kind: 'scan'|'move'|'alert'|'system'; message: string; }

const SAMPLE: LiveEvent[] = [
  { id: 'e1', ts: new Date(Date.now() - 4_000).toISOString(),  source: 'FORK-04',  kind: 'scan',   message: 'Pallet PLT-88412 scanned at Aisle A-12' },
  { id: 'e2', ts: new Date(Date.now() - 22_000).toISOString(), source: 'AGV-02',   kind: 'move',   message: 'Moved to Bay 3 → Dock 7' },
  { id: 'e3', ts: new Date(Date.now() - 45_000).toISOString(), source: 'SYSTEM',   kind: 'system', message: 'WMS sync completed in 420ms' },
  { id: 'e4', ts: new Date(Date.now() - 71_000).toISOString(), source: 'DOCK-02',  kind: 'alert',  message: 'Dwell time exceeds 90 min SLA' },
];

interface Props { events?: LiveEvent[]; max?: number; }

const KIND_COLOR: Record<LiveEvent['kind'], string> = {
  scan: 'text-blue-600', move: 'text-cyan-600', alert: 'text-red-600', system: 'text-slate-500',
};

export function TwinLiveStream({ events = SAMPLE, max = 50 }: Props) {
  return (
    <ul className="space-y-1 overflow-y-auto rounded-md border bg-card p-2 text-xs" style={{ maxHeight: 320 }}>
      {events.slice(0, max).map((e) => (
        <li key={e.id} className="flex items-start gap-2 border-b border-dashed py-1 last:border-0">
          <span className="tabular-nums text-muted-foreground">{new Date(e.ts).toLocaleTimeString('en-MY')}</span>
          <span className={`font-medium ${KIND_COLOR[e.kind]}`}>[{e.source}]</span>
          <span className="flex-1">{e.message}</span>
        </li>
      ))}
    </ul>
  );
}
export default TwinLiveStream;
