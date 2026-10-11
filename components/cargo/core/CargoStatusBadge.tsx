'use client';
import * as React from 'react';
import { Badge } from '@/components/ui/badge';
export interface CargoStatusBadgeProps { status?: string; zone?: 'FIZ' | 'FCZ'; }
export function CargoStatusBadge({ status = 'idle', zone }: CargoStatusBadgeProps) {
  const variant = /(error|fail|reject|blocked|held)/i.test(status) ? 'destructive' : /(ok|pass|done|approved|released)/i.test(status) ? 'default' : 'secondary';
  return (
    <span className="inline-flex ItemsCenter gap-1">
      <Badge variant={variant}>{status}</Badge>
      {zone ? <Badge variant={zone === 'FIZ' ? 'default' : 'outline'}>{zone}</Badge> : null}
    </span>
  );
}
export default CargoStatusBadge;
