'use client';

/**
 * ChainOfCustody
 * AiElements 2026 · composed surface. Replace body with real logic.
 */

import * as React from 'react';

export interface ChainOfCustodyLink { id: string; at: string; from: string; to: string; hash: string; }
export interface ChainOfCustodyProps { links?: ChainOfCustodyLink[]; }

export function ChainOfCustody({ links = [] }: ChainOfCustodyProps) {
  return (
    <ol className="SpaceY1 text-xs">
      {links.map((l) => <li key={l.id} className="rounded border p-2 FontMono">{l.at} · {l.from} → {l.to} · {l.hash.slice(0, 12)}…</li>)}
    </ol>
  );
}

export default ChainOfCustody;
