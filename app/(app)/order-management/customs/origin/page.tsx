'use client';

import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { OrderOriginSelector } from '@/components/order-management/customs-link/OrderOriginSelector';
import { trpc } from '@/lib/trpc';

export default function Page() {
  const records = trpc.orderManagement.customs.list.useQuery({ take: 100 });
  return (
    <div className="space-y-6">
      <PageHeader title="Origin" description="Country-of-origin records for order customs processing" />
      <OrderOriginSelector
        title="Origin records"
        value={records.isLoading ? '…' : records.data?.length ?? '—'}
        hint={records.error?.message}
      />
    </div>
  );
}
