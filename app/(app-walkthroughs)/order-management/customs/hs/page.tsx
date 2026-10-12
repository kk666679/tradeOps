'use client';

import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { OrderHsCodeLink } from '@/components/order-management/customs-link/OrderHsCodeLink';
import { trpc } from '@/lib/trpc';

export default function Page() {
  const records = trpc.orderManagement.customs.list.useQuery({ take: 100 });
  return (
    <div className="space-y-6">
      <PageHeader title="HS Classification" description="HS classification links for order customs processing" />
      <OrderHsCodeLink
        title="Classification records"
        value={records.isLoading ? '…' : records.data?.length ?? '—'}
        hint={records.error?.message}
      />
    </div>
  );
}
