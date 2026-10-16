'use client';

/**
 * DecisionLog
 * AiElements 2026 · composed surface. Replace body with real logic.
 */

import * as React from 'react';

export interface DecisionLogDecision { id: string; at: string; title: string; rationale: string; confidence?: number; }
export interface DecisionLogProps { decisions?: DecisionLogDecision[]; }

export function DecisionLog({ decisions = [] }: DecisionLogProps) {
  return (
    <ul className="SpaceY2 text-sm">
      {decisions.map((d) => (
        <li key={d.id} className="rounded border p-2">
          <div className="flex ItemsCenter JustifyBetween"><span className="FontMedium">{d.title}</span><span className="text-xs text-muted-foreground">{d.at}</span></div>
          <p className="Mt1 text-xs text-muted-foreground">{d.rationale}</p>
          {typeof d.confidence === 'number' ? <div className="Mt1 text-xs">confidence {(d.confidence * 100).toFixed(0)}%</div> : null}
        </li>
      ))}
    </ul>
  );
}

export default DecisionLog;
