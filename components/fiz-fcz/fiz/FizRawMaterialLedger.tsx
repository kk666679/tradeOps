'use client';

/**
 * FizRawMaterialLedger
 * Auto-scaffolded. Replace the body with domain logic.
 */

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export interface FizRawMaterialLedgerProps {
  title?: string;
  value?: React.ReactNode;
  hint?: string;
  className?: string;
}

export function FizRawMaterialLedger({ title = 'FizRawMaterialLedger', value, hint, className }: FizRawMaterialLedgerProps) {
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

export default FizRawMaterialLedger;
