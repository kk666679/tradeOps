'use client';

import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FulfilmentPlanner } from '@/components/order-management/fulfilment/FulfilmentPlanner';
import { trpc } from '@/lib/trpc';

export default function Page() {
  const orders = trpc.orderManagement.fulfilment.list.useQuery({ take: 100 });
  const activeCount = (orders.data ?? []).filter((record: any) => record.status !== 'CANCELLED').length;
  return (
    <div className="space-y-6">
      <PageHeader title="Planner" description="Current fulfilment workload from order records" />
      <FulfilmentPlanner
        title="Active fulfilment orders"
        value={orders.isLoading ? '…' : activeCount}
        hint={orders.error?.message}
      />
    </div>
  );
}
