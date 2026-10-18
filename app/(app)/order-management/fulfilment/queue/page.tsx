'use client';

import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FulfilmentQueue } from '@/components/order-management/fulfilment/FulfilmentQueue';
import { trpc } from '@/lib/trpc';

export default function Page() {
  const orders = trpc.orderManagement.fulfilment.list.useQuery({ take: 100 });
  const rows = (orders.data ?? []).map((record: any) => ({
    id: record.id,
    ref: String(record.ref ?? record.id),
    status: record.status,
    meta: record.metadata?.description,
  }));

  return (
    <div className="space-y-6">
      <PageHeader title="Fulfilment Queue" description="Orders currently moving through fulfilment" />
      <FulfilmentQueue rows={rows} />
      {orders.isLoading ? <p className="text-sm text-muted-foreground">Loading fulfilment orders…</p> : null}
      {orders.error ? <p className="text-sm text-destructive">{orders.error.message}</p> : null}
    </div>
  );
}
