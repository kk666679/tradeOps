'use client';

/**
 * EscalationBanner
 * AiElements 2026 · composed surface. Replace body with real logic.
 */

import * as React from 'react';
import { Badge } from '@/components/ui/badge';

export interface EscalationBannerProps { reason: string; severity?: 'low' | 'medium' | 'high' | 'critical'; onAck?: () => void; }

export function EscalationBanner({ reason, severity = 'medium', onAck }: EscalationBannerProps) {
  return (
    <div className="flex ItemsCenter JustifyBetween rounded border border-amber-300 bg-amber-50 p-2 text-sm text-amber-900">
      <span>{reason}</span>
      <span className="flex ItemsCenter gap-2"><Badge variant="outline">{severity}</Badge><button className="underline" onClick={onAck}>Acknowledge</button></span>
    </div>
  );
}

export default EscalationBanner;
