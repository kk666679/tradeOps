'use client';

import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { OrderDutyEstimator } from '@/components/order-management/customs-link/OrderDutyEstimator';
import { trpc } from '@/lib/trpc';

export default function Page() {
  const records = trpc.orderManagement.customs.list.useQuery({ take: 100 });
  return (
    <div className="space-y-6">
      <PageHeader title="Duty" description="Review customs duty data linked to orders" />
      <OrderDutyEstimator
        title="Duty records"
        value={records.isLoading ? '…' : records.data?.length ?? '—'}
        hint={records.error?.message}
      />
    </div>
  );
}
