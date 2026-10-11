'use client';
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface aiIntegrationRetryAdvisorProps { title?: string; value?: React.ReactNode; hint?: string; zone?: 'FIZ' | 'FCZ'; className?: string; }
export function aiIntegrationRetryAdvisor({ title = 'aiIntegrationRetryAdvisor', value, hint, zone, className }: aiIntegrationRetryAdvisorProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {zone ? <span className="text-xs text-muted-foreground">{zone}</span> : null}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value ?? '—'}</div>
        {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}
export default aiIntegrationRetryAdvisor;
