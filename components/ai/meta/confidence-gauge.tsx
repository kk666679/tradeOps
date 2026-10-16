'use client';

/**
 * ConfidenceGauge
 * AiElements 2026 · composed surface. Replace body with real logic.
 */

import * as React from 'react';

export interface ConfidenceGaugeProps { value: number; label?: string; }

export function ConfidenceGauge({ value, label = 'confidence' }: ConfidenceGaugeProps) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  const tone = pct < 40 ? 'bg-red-500' : pct < 70 ? 'bg-amber-500' : 'bg-emerald-500';
  return (
    <div className="SpaceY1 text-xs">
      <div className="flex JustifyBetween"><span>{label}</span><span>{pct.toFixed(0)}%</span></div>
      <div className="h-2 w-full rounded bg-muted"><div className={'h-2 rounded ' + tone} style={{ width: pct + '%' }} /></div>
    </div>
  );
}

export default ConfidenceGauge;
