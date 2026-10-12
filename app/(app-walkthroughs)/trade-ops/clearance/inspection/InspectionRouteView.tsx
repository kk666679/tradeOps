'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { InspectionScheduler } from '@/components/trade-ops/clearance/InspectionScheduler';
import { TradeOpsListView } from '@/components/trade-ops/TradeOpsListView';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { trpc } from '@/lib/trpc/react';

export function InspectionRouteView() {
  const router = useRouter();
  const utils = trpc.useUtils();
  const declarations = trpc.tradeOps.declarations.list.useQuery({ take: 100 });
  const createClearance = trpc.tradeOps.clearance.create.useMutation();
  const [message, setMessage] = React.useState<string>();

  const handleSubmit = async (values: Record<string, unknown>) => {
    const ref = String(values.ref ?? '').trim();
    if (!ref) {
      setMessage('Enter a declaration reference to schedule an inspection.');
      return;
    }
    if (declarations.isLoading) {
      setMessage('Declarations are still loading. Try again in a moment.');
      return;
    }
    if (declarations.isError) {
      setMessage('Could not load declarations. Refresh the page and try again.');
      return;
    }

    const declaration = (declarations.data ?? []).find(
      (item: { id: string; ref: string; channel: 'GREEN' | 'YELLOW' | 'RED' | null }) => item.ref === ref,
    );
    if (!declaration) {
      setMessage(`No declaration with reference ${ref} was found.`);
      return;
    }
    if (!declaration.channel) {
      setMessage('The declaration must have a customs channel before an inspection can be scheduled.');
      return;
    }

    setMessage(undefined);
    try {
      await createClearance.mutateAsync({
        declarationId: declaration.id,
        channel: declaration.channel,
        inspectionAt: new Date(),
      });
      await utils.tradeOps.clearance.list.invalidate();
      setMessage('Inspection scheduled.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not schedule the inspection.');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Inspection" description="Schedule an inspection against an existing customs declaration." />
      <Card>
        <CardHeader><CardTitle>Schedule an inspection</CardTitle></CardHeader>
        <CardContent>
          <InspectionScheduler
            submitting={createClearance.isPending}
            onSubmit={handleSubmit}
            onCancel={() => router.push('/trade-ops/clearance')}
          />
          {message ? <p className="mt-3 text-sm text-muted-foreground" role="status">{message}</p> : null}
        </CardContent>
      </Card>
      <TradeOpsListView
        procedure="clearance"
        config={{
          title: 'Clearance records',
          description: 'Tenant-scoped clearance records, including scheduled inspections.',
          empty: 'No clearance records have been created yet.',
          detailHref: '/trade-ops/clearance',
          columns: ['channel', 'inspectionAt', 'releasedAt', 'officer'],
        }}
      />
    </div>
  );
}
