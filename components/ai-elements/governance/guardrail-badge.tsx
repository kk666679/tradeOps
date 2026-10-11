'use client';

/**
 * GuardrailBadge
 * AiElements 2026 · composed surface. Replace body with real logic.
 */

import * as React from 'react';
import { Badge } from '@/components/ui/badge';

export interface GuardrailBadgeProps { id: string; mode?: 'FailClosed' | 'FailOpen'; severity?: 'info' | 'warn' | 'block'; }

export function GuardrailBadge({ id, mode = 'FailClosed', severity = 'info' }: GuardrailBadgeProps) {
  const variant = severity === 'block' ? 'destructive' : severity === 'warn' ? 'secondary' : 'outline';
  return <Badge variant={variant} title={mode}>{id}</Badge>;
}

export default GuardrailBadge;
