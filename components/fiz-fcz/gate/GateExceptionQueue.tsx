'use client';

/**
 * GateExceptionQueue
 * Auto-scaffolded. Replace the body with domain logic.
 */

import * as React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface GateExceptionQueueItem { id: string; label: string; meta?: string; }
export interface GateExceptionQueueProps { items?: GateExceptionQueueItem[]; empty?: string; onSelect?: (i: GateExceptionQueueItem) => void; }

export function GateExceptionQueue({ items = [], empty = 'No records', onSelect }: GateExceptionQueueProps) {
  if (!items.length) return <div className="p-6 text-sm text-muted-foreground">{empty}</div>;
  return (
    <ScrollArea className="h-full">
      <ul className="divide-y">
        {items.map((it) => (
          <li key={it.id} onClick={() => onSelect?.(it)} className="cursor-pointer p-3 hover:bg-accent">
            <div className="font-medium">{it.label}</div>
            {it.meta ? <div className="text-xs text-muted-foreground">{it.meta}</div> : null}
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}

export default GateExceptionQueue;
