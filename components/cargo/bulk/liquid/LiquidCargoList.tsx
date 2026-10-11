'use client';
import * as React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

export interface LiquidCargoListRow { id: string; ref: string; zone?: 'FIZ' | 'FCZ'; status?: string; meta?: string; }
export interface LiquidCargoListProps { rows?: LiquidCargoListRow[]; empty?: string; onSelect?: (r: LiquidCargoListRow) => void; }
export function LiquidCargoList({ rows = [], empty = 'No records', onSelect }: LiquidCargoListProps) {
  if (!rows.length) return <div className="p-6 text-sm text-muted-foreground">{empty}</div>;
  return (
    <ScrollArea className="h-full">
      <table className="w-full text-sm">
        <thead className="bg-muted/40 text-xs uppercase">
          <tr><th className="p-2 text-left">Ref</th><th className="p-2 text-left">Zone</th><th className="p-2 text-left">Status</th><th className="p-2 text-left">Meta</th></tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} onClick={() => onSelect?.(r)} className="CursorPointer border-b last:border-0 hover:bg-accent">
              <td className="p-2 FontMono">{r.ref}</td>
              <td className="p-2">{r.zone ? <Badge variant={r.zone === 'FIZ' ? 'default' : 'secondary'}>{r.zone}</Badge> : '—'}</td>
              <td className="p-2">{r.status ?? '—'}</td>
              <td className="p-2 text-xs text-muted-foreground">{r.meta ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollArea>
  );
}
export default LiquidCargoList;
