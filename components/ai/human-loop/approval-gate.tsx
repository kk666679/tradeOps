'use client';

/**
 * ApprovalGate
 * AiElements 2026 · composed surface. Replace body with real logic.
 */

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface ApprovalGateProps {
  title?: string;
  reason?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  amountUsd?: number;
  onApprove?: () => void; onReject?: () => void;
  busy?: boolean;
}

export function ApprovalGate({ title = 'Approval required', reason, severity = 'medium', amountUsd, onApprove, onReject, busy }: ApprovalGateProps) {
  const tone = severity === 'critical' ? 'border-red-300 bg-red-50' : severity === 'high' ? 'border-amber-300 bg-amber-50' : 'border-sky-300 bg-sky-50';
  return (
    <div className={'rounded border p-3 text-sm ' + tone}>
      <div className="flex ItemsCenter JustifyBetween"><span className="FontMedium">{title}</span><Badge variant="outline">{severity}</Badge></div>
      {reason ? <p className="Mt1 text-xs">{reason}</p> : null}
      {typeof amountUsd === 'number' ? <p className="Mt1 text-xs">Amount: ${amountUsd.toLocaleString()}</p> : null}
      <div className="Mt2 flex gap-2"><Button size="sm" onClick={onApprove} disabled={busy}>Approve</Button><Button size="sm" variant="outline" onClick={onReject} disabled={busy}>Reject</Button></div>
    </div>
  );
}

export default ApprovalGate;
