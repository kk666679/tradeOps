'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
export interface PurchaseApprovalPanelItem { id: string; ref: string; reason: string; severity: 'low' | 'medium' | 'high'; }
export interface PurchaseApprovalPanelProps { items?: PurchaseApprovalPanelItem[]; onApprove?: (id: string) => void; onReject?: (id: string) => void; }
export function PurchaseApprovalPanel({ items = [], onApprove, onReject }: PurchaseApprovalPanelProps) {
  if (!items.length) return <p className="p-4 text-sm text-muted-foreground">No pending approvals</p>;
  return (
    <ul className="divide-y rounded border">
      {items.map((i) => (
        <li key={i.id} className="flex items-center justify-between p-3">
          <div>
            <div className="font-mono text-sm">{i.ref}</div>
            <div className="text-xs text-muted-foreground">{i.reason}</div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={i.severity === 'high' ? 'destructive' : i.severity === 'medium' ? 'secondary' : 'outline'}>{i.severity}</Badge>
            <Button size="sm" onClick={() => onApprove?.(i.id)}>Approve</Button>
            <Button size="sm" variant="outline" onClick={() => onReject?.(i.id)}>Reject</Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
export default PurchaseApprovalPanel;
