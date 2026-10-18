'use client';

import * as React from 'react';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { ValuationReview } from '@/components/trade-ops/compliance/ValuationReview';
import { TradeOpsListView } from '@/components/trade-ops/TradeOpsListView';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { trpc } from '@/lib/trpc/react';

export function ValuationRouteView() {
  const utils = trpc.useUtils();
  const createFinding = trpc.tradeOps.compliance.create.useMutation();
  const [message, setMessage] = React.useState<string>();

  const handleSubmit = async (values: Record<string, unknown>) => {
    const ref = String(values.ref ?? '').trim();
    if (!ref) {
      setMessage('Enter a declaration reference before submitting the valuation review.');
      return;
    }

    setMessage(undefined);
    try {
      await createFinding.mutateAsync({
        kind: 'valuation',
        severity: 'MEDIUM',
        message: `Valuation review requested for declaration ${ref}`,
      });
      await utils.tradeOps.compliance.list.invalidate();
      setMessage('Valuation review recorded.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not record the valuation review.');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Valuation" description="Record and review valuation findings for customs declarations." />
      <Card>
        <CardHeader><CardTitle>Record a valuation review</CardTitle></CardHeader>
        <CardContent>
          <ValuationReview
            submitting={createFinding.isPending}
            onSubmit={handleSubmit}
          />
          {message ? <p className="mt-3 text-sm text-muted-foreground" role="status">{message}</p> : null}
        </CardContent>
      </Card>
      <TradeOpsListView
        procedure="compliance"
        config={{
          title: 'Valuation findings',
          description: 'Tenant-scoped valuation findings recorded for declarations.',
          empty: 'No valuation findings have been recorded yet.',
          columns: ['severity', 'kind', 'message', 'resolvedAt', 'resolvedBy'],
          filter: { field: 'kind', value: 'valuation' },
        }}
      />
    </div>
  );
}
