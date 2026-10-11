'use client';
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface ZoneRoutingDecisionProps { title?: string; value?: React.ReactNode; hint?: string; className?: string; }
export function ZoneRoutingDecision({ title = 'ZoneRoutingDecision', value, hint, className }: ZoneRoutingDecisionProps) {
  return (
    <Card className={className}>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value ?? '—'}</div>
        {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}
export default ZoneRoutingDecision;
