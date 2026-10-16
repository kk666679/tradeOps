'use client';

/**
 * ContextInspector
 * AiElements 2026 · composed surface. Replace body with real logic.
 */

import * as React from 'react';

export interface ContextInspectorItem { id: string; source: string; tokens: number; score?: number; }
export interface ContextInspectorProps { items?: ContextInspectorItem[]; budgetTokens?: number; }

export function ContextInspector({ items = [], budgetTokens = 128000 }: ContextInspectorProps) {
  const used = items.reduce((a, b) => a + b.tokens, 0);
  const pct = Math.min(100, Math.round((used / budgetTokens) * 100));
  return (
    <div className="SpaceY2 text-xs">
      <div className="flex JustifyBetween"><span>Context</span><span>{used.toLocaleString()} / {budgetTokens.toLocaleString()} ({pct}%)</span></div>
      <div className="h-2 w-full rounded bg-muted"><div className="h-2 rounded bg-primary" style={{ width: pct + '%' }} /></div>
      <ul className="SpaceY1">{items.map((i) => <li key={i.id} className="flex JustifyBetween"><span className="FontMono">{i.source}</span><span>{i.tokens} · {i.score?.toFixed(2) ?? '—'}</span></li>)}</ul>
    </div>
  );
}

export default ContextInspector;
