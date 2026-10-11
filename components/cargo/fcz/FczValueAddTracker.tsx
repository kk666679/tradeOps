'use client';
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface FczValueAddTrackerProps { title?: string; value?: React.ReactNode; hint?: string; zone?: 'FIZ' | 'FCZ'; className?: string; }
export function FczValueAddTracker({ title = 'FczValueAddTracker', value, hint, zone, className }: FczValueAddTrackerProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row ItemsCenter JustifyBetween">
        <CardTitle>{title}</CardTitle>
        {zone ? <span className="text-xs text-muted-foreground">{zone}</span> : null}
      </CardHeader>
      <CardContent>
        <div className="text-2xl FontSemibold">{value ?? '—'}</div>
        {hint ? <p className="Mt1 text-xs text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}
export default FczValueAddTracker;
