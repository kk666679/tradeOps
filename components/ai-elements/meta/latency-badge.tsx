'use client';

/**
 * LatencyBadge
 * AiElements 2026 · composed surface. Replace body with real logic.
 */

import * as React from 'react';
import { Badge } from '@/components/ui/badge';

export interface LatencyBadgeProps { ms: number; }

export function LatencyBadge({ ms }: LatencyBadgeProps) {
  const variant = ms > 4000 ? 'destructive' : ms > 1500 ? 'secondary' : 'outline';
  return <Badge variant={variant}>{ms} ms</Badge>;
}

export default LatencyBadge;
