'use client';
import * as React from 'react';
import { Badge } from '@/components/ui/badge';

export interface AgentMeshLogTableLog { id: string; at: string; direction: 'IN' | 'OUT'; status: number; payload?: string; zone?: 'FIZ' | 'FCZ'; }
export interface AgentMeshLogTableProps { logs?: AgentMeshLogTableLog[]; empty?: string; }
export function AgentMeshLogTable({ logs = [], empty = 'No log entries' }: AgentMeshLogTableProps) {
  if (!logs.length) return <div className="p-4 text-xs text-muted-foreground">{empty}</div>;
  return (
    <div className="rounded border">
      <table className="w-full text-xs">
        <thead className="bg-muted/40 uppercase"><tr><th className="p-2 text-left">At</th><th className="p-2">Dir</th><th className="p-2">Status</th><th className="p-2 text-left">Payload</th></tr></thead>
        <tbody>
          {logs.map((l) => (
            <tr key={l.id} className="border-b last:border-0">
              <td className="p-2">{l.at}</td>
              <td className="p-2 text-center"><Badge variant={l.direction === 'IN' ? 'default' : 'outline'}>{l.direction}</Badge></td>
              <td className="p-2 text-center"><Badge variant={l.status < 400 ? 'secondary' : 'destructive'}>{l.status}</Badge></td>
              <td className="truncate p-2 font-mono text-[10px]">{l.payload ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default AgentMeshLogTable;
