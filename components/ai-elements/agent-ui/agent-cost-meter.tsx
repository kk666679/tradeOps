'use client';

/**
 * AgentCostMeter
 * AiElements 2026 · composed surface. Replace body with real logic.
 */

import * as React from 'react';

export interface AgentCostMeterProps { spentUsd: number; budgetUsd: number; }

export function AgentCostMeter({ spentUsd, budgetUsd }: AgentCostMeterProps) {
  const pct = Math.max(0, Math.min(1, spentUsd / Math.max(0.01, budgetUsd))) * 100;
  const tone = pct > 90 ? 'bg-red-500' : pct > 70 ? 'bg-amber-500' : 'bg-emerald-500';
  return (
    <div className="SpaceY1 text-xs">
      <div className="flex JustifyBetween"><span>Cost</span><span>${spentUsd.toFixed(2)} / ${budgetUsd.toFixed(2)}</span></div>
      <div className="h-2 w-full rounded bg-muted"><div className={'h-2 rounded ' + tone} style={{ width: pct + '%' }} /></div>
    </div>
  );
}

export default AgentCostMeter;
