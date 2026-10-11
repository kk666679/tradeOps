'use client';

/**
 * SpendAuthorityCard
 * AiElements 2026 · composed surface. Replace body with real logic.
 */

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface SpendAuthorityCardProps { role: string; maxUsd: number; requireHitlAboveUsd: number; }

export function SpendAuthorityCard({ role, maxUsd, requireHitlAboveUsd }: SpendAuthorityCardProps) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-sm">{role}</CardTitle></CardHeader>
      <CardContent className="SpaceY1 text-xs">
        <div className="flex JustifyBetween"><span>Max</span><span>${maxUsd.toLocaleString()}</span></div>
        <div className="flex JustifyBetween"><span>HITL above</span><span>${requireHitlAboveUsd.toLocaleString()}</span></div>
      </CardContent>
    </Card>
  );
}

export default SpendAuthorityCard;
