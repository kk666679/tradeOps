'use client';

/**
 * EmbeddingExplorer
 * AiElements 2026 · composed surface. Replace body with real logic.
 */

import * as React from 'react';

export interface EmbeddingExplorerPoint { id: string; x: number; y: number; label: string; }
export interface EmbeddingExplorerProps { points?: EmbeddingExplorerPoint[]; }

export function EmbeddingExplorer({ points = [] }: EmbeddingExplorerProps) {
  return (
    <div className="relative h-64 w-full rounded border bg-muted/30">
      {points.map((p) => <span key={p.id} className="absolute h-2 w-2 rounded-full bg-primary" style={{ left: p.x, top: p.y }} title={p.label} />)}
    </div>
  );
}

export default EmbeddingExplorer;
