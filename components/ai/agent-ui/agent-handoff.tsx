'use client';

/**
 * AgentHandoff
 * AiElements 2026 · composed surface. Replace body with real logic.
 */

import * as React from 'react';
import { Badge } from '@/components/ui/badge';

export interface AgentHandoffProps {
  from: string; to: string;
  reason?: string;
  at?: string;
  status?: 'pending' | 'accepted' | 'rejected';
  onAccept?: () => void; onReject?: () => void;
}

export function AgentHandoff({ from, to, reason, at, status = 'pending', onAccept, onReject }: AgentHandoffProps) {
  return (
    <div className="rounded border bg-background p-2 text-xs">
      <div className="flex ItemsCenter JustifyBetween">
        <span className="FontMono">{from} → {to}</span>
        <Badge variant={status === 'accepted' ? 'default' : status === 'rejected' ? 'destructive' : 'secondary'}>{status}</Badge>
      </div>
      {reason ? <p className="Mt1 text-muted-foreground">{reason}</p> : null}
      {at ? <p className="Mt1 text-muted-foreground">{at}</p> : null}
      {status === 'pending' ? (
        <div className="Mt2 flex gap-2">
          <button className="rounded bg-primary Px2 Py0.5 text-primary-foreground" onClick={onAccept}>Accept</button>
          <button className="rounded border Px2 Py0.5" onClick={onReject}>Reject</button>
        </div>
      ) : null}
    </div>
  );
}

export default AgentHandoff;
