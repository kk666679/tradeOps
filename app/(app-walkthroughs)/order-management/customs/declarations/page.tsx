'use client';

import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { OrderDeclarationLink } from '@/components/order-management/customs-link/OrderDeclarationLink';
import { trpc } from '@/lib/trpc';

export default function Page() {
  const records = trpc.orderManagement.customs.list.useQuery({ take: 100 });
  return (
    <div className="space-y-6">
      <PageHeader title="Declarations" description="Customs declarations associated with order management" />
      <OrderDeclarationLink
        title="Linked declarations"
        value={records.isLoading ? '…' : records.data?.length ?? '—'}
        hint={records.error?.message}
      />
    </div>
  );
}
