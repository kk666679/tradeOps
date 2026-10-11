'use client';
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface IntegrationHealthGridEntry { id: string; name: string; status: 'ok' | 'warn' | 'down'; latencyMs?: number; zone?: 'FIZ' | 'FCZ' | 'ALL'; }
export interface IntegrationHealthGridProps { entries?: IntegrationHealthGridEntry[]; }
export function IntegrationHealthGrid({ entries = [] }: IntegrationHealthGridProps) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {entries.map((e) => (
        <Card key={e.id}>
          <CardHeader className="flex flex-row items-center justify-between"><CardTitle className="text-sm">{e.name}</CardTitle><Badge variant={e.status === 'down' ? 'destructive' : e.status === 'warn' ? 'secondary' : 'default'}>{e.status}</Badge></CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            <div className="flex justify-between"><span>{e.latencyMs ?? '—'} ms</span><span>{e.zone ?? '—'}</span></div>
          </CardContent>
        </Card>
      ))}
      {entries.length === 0 ? <div className="p-4 text-xs text-muted-foreground">No integrations registered</div> : null}
    </div>
  );
}
export default IntegrationHealthGrid;
