'use client';

import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { OrderFtaPreferenceSelector } from '@/components/order-management/customs-link/OrderFtaPreferenceSelector';
import { trpc } from '@/lib/trpc';

export default function Page() {
  const records = trpc.orderManagement.customs.list.useQuery({ take: 100 });
  return (
    <div className="space-y-6">
      <PageHeader title="FTA Preference" description="Preferential trade agreement records for orders" />
      <OrderFtaPreferenceSelector
        title="FTA records"
        value={records.isLoading ? '…' : records.data?.length ?? '—'}
        hint={records.error?.message}
      />
    </div>
  );
}
