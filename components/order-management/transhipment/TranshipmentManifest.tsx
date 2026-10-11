'use client';
import * as React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
export interface TranshipmentManifestLine { id: string; hs: string; description: string; qty: number; value?: number; origin?: string; }
export interface TranshipmentManifestProps { lines?: TranshipmentManifestLine[]; mode?: 'SEA' | 'AIR' | 'ROAD' | 'RAIL'; }
export function TranshipmentManifest({ lines = [], mode = 'SEA' }: TranshipmentManifestProps) {
  return (
    <ScrollArea className="h-64 rounded border">
      <table className="w-full text-xs">
        <thead className="bg-muted/40 uppercase"><tr><th className="p-2 text-left">HS</th><th className="p-2 text-left">Description</th><th className="p-2 text-right">Qty</th><th className="p-2 text-left">Origin</th></tr></thead>
        <tbody>
          {lines.map((l) => (
            <tr key={l.id} className="border-b last:border-0">
              <td className="p-2 font-mono">{l.hs}</td>
              <td className="p-2">{l.description}</td>
              <td className="p-2 text-right">{l.qty}</td>
              <td className="p-2">{l.origin ?? '—'}</td>
            </tr>
          ))}
          {lines.length === 0 ? <tr><td colSpan={4} className="p-4 text-center text-muted-foreground">No lines · mode {mode}</td></tr> : null}
        </tbody>
      </table>
    </ScrollArea>
  );
}
export default TranshipmentManifest;
