'use client';

import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { ZoneRoutingDecision } from '@/components/order-management/fulfilment/ZoneRoutingDecision';
import { trpc } from '@/lib/trpc';

export default function Page() {
  const orders = trpc.orderManagement.fulfilment.list.useQuery({ take: 100 });
  const routedCount = (orders.data ?? []).filter((record: any) => record.zoneRouting != null).length;
  return (
    <div className="space-y-6">
      <PageHeader title="Routing" description="Review existing fulfilment zone-routing decisions" />
      <ZoneRoutingDecision
        title="Orders with routing decisions"
        value={orders.isLoading ? '…' : routedCount}
        hint={orders.error?.message}
      />
    </div>
  );
}
