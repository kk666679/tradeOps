'use client';
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface SlotAllocationBoardProps { title?: string; value?: React.ReactNode; hint?: string; className?: string; }
export function SlotAllocationBoard({ title = 'SlotAllocationBoard', value, hint, className }: SlotAllocationBoardProps) {
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
export default SlotAllocationBoard;
