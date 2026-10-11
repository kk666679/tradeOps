'use client';
import * as React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface InventoryListRow { id: string; ref: string; status?: string; zone?: 'FIZ' | 'FCZ'; meta?: string; }
export interface InventoryListProps { rows?: InventoryListRow[]; empty?: string; onSelect?: (r: InventoryListRow) => void; onDelete?: (r: InventoryListRow) => void; deletingId?: string; }
export function InventoryList({ rows = [], empty = 'No records', onSelect, onDelete, deletingId }: InventoryListProps) {
  if (!rows.length) return <div className="p-6 text-sm text-muted-foreground">{empty}</div>;
  return (
    <ScrollArea className="max-h-[32rem]">
      <table className="w-full text-sm">
        <thead className="bg-muted/40 text-xs uppercase">
          <tr><th className="p-2 text-left">SKU</th><th className="p-2 text-left">Zone</th><th className="p-2 text-left">Status</th><th className="p-2 text-left">Stock</th><th className="p-2 text-right">Actions</th></tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b last:border-0 hover:bg-accent/50">
              <td className="p-2 font-mono">{r.ref}</td>
              <td className="p-2"><Badge variant={r.zone === 'FIZ' ? 'default' : 'secondary'}>{r.zone ?? '—'}</Badge></td>
              <td className="p-2">{r.status ?? '—'}</td>
              <td className="p-2 text-xs text-muted-foreground">{r.meta ?? ''}</td>
              <td className="p-2">
                <div className="flex justify-end gap-1">
                  {onSelect && <Button type="button" variant="ghost" size="icon-sm" title={`Edit ${r.ref}`} aria-label={`Edit ${r.ref}`} onClick={() => onSelect(r)}><Pencil /></Button>}
                  {onDelete && <Button type="button" variant="ghost" size="icon-sm" title={`Delete ${r.ref}`} aria-label={`Delete ${r.ref}`} disabled={deletingId === r.id} onClick={() => onDelete(r)}><Trash2 /></Button>}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollArea>
  );
}
export default InventoryList;
