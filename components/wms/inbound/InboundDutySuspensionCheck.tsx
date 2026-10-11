'use client';
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface InboundDutySuspensionCheckProps { title?: string; value?: React.ReactNode; hint?: string; className?: string; }
export function InboundDutySuspensionCheck({ title = 'InboundDutySuspensionCheck', value, hint, className }: InboundDutySuspensionCheckProps) {
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
export default InboundDutySuspensionCheck;
