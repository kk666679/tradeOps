'use client';
import * as React from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

export interface LiveAlert { id: string; severity: 'info'|'warn'|'critical'; title: string; ts: string; }

const SAMPLE: LiveAlert[] = [
  { id: 'a1', severity: 'critical', title: 'Dock 2 dwell exceeds SLA',       ts: new Date(Date.now() - 60_000).toISOString() },
  { id: 'a2', severity: 'warn',     title: 'AGV-02 battery below 20%',       ts: new Date(Date.now() - 180_000).toISOString() },
  { id: 'a3', severity: 'info',     title: 'Shift B staffed at 94% capacity',ts: new Date(Date.now() - 600_000).toISOString() },
];

const STYLE = {
  info:     { icon: Info,          cls: 'border-blue-200 bg-blue-50 text-blue-900' },
  warn:     { icon: AlertTriangle, cls: 'border-amber-200 bg-amber-50 text-amber-900' },
  critical: { icon: AlertCircle,   cls: 'border-red-200 bg-red-50 text-red-900' },
} as const;

export function TwinLiveAlerts({ alerts = SAMPLE }: { alerts?: LiveAlert[] }) {
  return (
    <ul className="space-y-2">
      {alerts.map((a) => {
        const { icon: Icon, cls } = STYLE[a.severity];
        return (
          <li key={a.id} className={`flex items-start gap-2 rounded-md border p-2 text-sm ${cls}`}>
            <Icon className="mt-0.5 h-4 w-4 shrink-0" />
            <div className="flex-1">
              <div className="font-medium">{a.title}</div>
              <div className="text-[11px] opacity-70">{new Date(a.ts).toLocaleTimeString('en-MY')}</div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
export default TwinLiveAlerts;
