'use client';

/**
 * CostMeter
 * AiElements 2026 · composed surface. Replace body with real logic.
 */

import * as React from 'react';

export interface CostMeterProps { usd: number; currency?: string; }

export function CostMeter({ usd, currency = 'USD' }: CostMeterProps) {
  return <span className="text-xs text-muted-foreground">{usd.toFixed(4)} {currency}</span>;
}

export default CostMeter;
