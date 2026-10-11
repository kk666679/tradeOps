'use client';
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface aiSubcontractAdvisorProps { title?: string; value?: React.ReactNode; hint?: string; className?: string; }
export function aiSubcontractAdvisor({ title = 'aiSubcontractAdvisor', value, hint, className }: aiSubcontractAdvisorProps) {
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
export default aiSubcontractAdvisor;
