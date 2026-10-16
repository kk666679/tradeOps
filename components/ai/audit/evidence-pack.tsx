'use client';

/**
 * EvidencePack
 * AiElements 2026 · composed surface. Replace body with real logic.
 */

import * as React from 'react';
import { Button } from '@/components/ui/button';

export interface EvidencePackProps { runId: string; artifacts?: { id: string; label: string; href?: string }[]; onExport?: () => void; }

export function EvidencePack({ runId, artifacts = [], onExport }: EvidencePackProps) {
  return (
    <div className="SpaceY2 rounded border p-3 text-sm">
      <div className="flex ItemsCenter JustifyBetween"><span className="FontMedium">Evidence · {runId}</span><Button size="sm" variant="outline" onClick={onExport}>Export</Button></div>
      <ul className="SpaceY1 text-xs">{artifacts.map((a) => <li key={a.id}><a className="underline" href={a.href ?? '#'}>{a.label}</a></li>)}</ul>
    </div>
  );
}

export default EvidencePack;
