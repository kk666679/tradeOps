'use client';

/**
 * AgentConcurrencyMeter
 * AiElements 2026 · composed surface. Replace body with real logic.
 */

import * as React from 'react';

export interface AgentConcurrencyMeterProps { running: number; max: number; }

export function AgentConcurrencyMeter({ running, max }: AgentConcurrencyMeterProps) {
  return <div className="text-xs text-muted-foreground">Running {running} / {max}</div>;
}

export default AgentConcurrencyMeter;
