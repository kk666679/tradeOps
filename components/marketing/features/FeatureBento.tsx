'use client';
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface FeatureBentoCell { id: string; title: string; body: string; span?: 1 | 2; tone?: 'sky' | 'amber' | 'violet'; }
export interface FeatureBentoProps { cells: FeatureBentoCell[]; }
export function FeatureBento({ cells }: FeatureBentoProps) {
  const tone = (t?: string) => t === 'sky' ? 'bg-sky-50' : t === 'amber' ? 'bg-amber-50' : t === 'violet' ? 'bg-violet-50' : '';
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cells.map((c) => (
        <Card key={c.id} className={(c.span === 2 ? 'md:col-span-2 ' : '') + tone(c.tone)}>
          <CardHeader><CardTitle className="text-base">{c.title}</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">{c.body}</CardContent>
        </Card>
      ))}
    </div>
  );
}
export default FeatureBento;
