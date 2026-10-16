'use client';

/**
 * MemoryInspector
 * AiElements 2026 · composed surface. Replace body with real logic.
 */

import * as React from 'react';

export interface MemoryInspectorEntry { id: string; kind: 'ShortTerm' | 'LongTerm' | 'episodic'; key: string; value: unknown; at: string; }
export interface MemoryInspectorProps { entries?: MemoryInspectorEntry[]; onSelect?: (e: MemoryInspectorEntry) => void; }

export function MemoryInspector({ entries = [], onSelect }: MemoryInspectorProps) {
  return (
    <ul className="SpaceY1 text-xs">
      {entries.map((e) => (
        <li key={e.id} onClick={() => onSelect?.(e)} className="CursorPointer rounded border p-2 hover:bg-accent">
          <div className="flex JustifyBetween"><span className="FontMono">{e.key}</span><span className="text-muted-foreground">{e.kind} · {e.at}</span></div>
        </li>
      ))}
    </ul>
  );
}

export default MemoryInspector;
