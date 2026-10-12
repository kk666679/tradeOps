'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';

export function FizOperatorDetails({ id }: { id: string }) {
  const query = trpc.fiz.operators.byId.useQuery({ id }, { retry: false, enabled: Boolean(id) });

  if (query.isLoading) {
    return <p role="status" className="rounded-md border p-4 text-sm text-muted-foreground">Loading operator details…</p>;
  }

  if (query.error) {
    return (
      <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-destructive/40 p-4 text-sm">
        <span>{query.error.message || 'Unable to load this operator.'}</span>
        <Button type="button" variant="outline" onClick={() => { void query.refetch(); }}>Retry</Button>
      </div>
    );
  }

  if (!query.data) {
    return <p className="rounded-md border p-4 text-sm text-muted-foreground">No operator was found for this ID.</p>;
  }

  const operator = query.data;
  const details = [
    ['Operator name', operator.name],
    ['Operator code', operator.code],
    ['Status', operator.status],
    ['Approval reference', operator.approvalRef],
    ['Approved at', operator.approvedAt?.toLocaleDateString()],
  ] as const;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{operator.name}</CardTitle>
        <p className="text-sm text-muted-foreground">FIZ operator record</p>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-4 sm:grid-cols-2">
          {details.map(([label, value]) => (
            <div key={label}>
              <dt className="text-sm text-muted-foreground">{label}</dt>
              <dd className="mt-1 font-medium">{value || '—'}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
