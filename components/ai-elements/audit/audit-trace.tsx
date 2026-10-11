'use client';

/**
 * AuditTrace
 * AiElements 2026 · composed surface. Replace body with real logic.
 */

import * as React from 'react';

export interface AuditTraceEntry { id: string; at: string; actor: 'agent'|'human'|'system'; action: string; target?: string; hash?: string; prevHash?: string; }
export interface AuditTraceProps { entries?: AuditTraceEntry[]; onSelect?: (e: AuditTraceEntry) => void; }

export function AuditTrace({ entries = [], onSelect }: AuditTraceProps) {
  return (
    <ol className="SpaceY1 text-xs">
      {entries.map((e) => (
        <li key={e.id} onClick={() => onSelect?.(e)} className="CursorPointer rounded border p-2 hover:bg-accent">
          <div className="flex ItemsCenter JustifyBetween"><span className="FontMono">{e.action}</span><span className="text-muted-foreground">{e.at}</span></div>
          <div className="text-muted-foreground">{e.actor} · {e.target ?? '—'}</div>
        </li>
      ))}
      {entries.length === 0 ? <li className="text-muted-foreground">No entries</li> : null}
    </ol>
  );
}

export default AuditTrace;
