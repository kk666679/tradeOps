'use client';

/**
 * AgentStatus
 * AiElements 2026 · composed surface. Replace body with real logic.
 */

import * as React from 'react';
import { Badge } from '@/components/ui/badge';

export type AgentStatusValue = 'idle' | 'thinking' | 'tool' | 'waiting_approval' | 'error';

export interface AgentStatusProps { status: AgentStatusValue; label?: string; }

export function AgentStatus({ status, label }: AgentStatusProps) {
  const variant = status === 'error' ? 'destructive' : status === 'waiting_approval' ? 'secondary' : 'outline';
  return <Badge variant={variant}>{label ?? status}</Badge>;
}

export default AgentStatus;
