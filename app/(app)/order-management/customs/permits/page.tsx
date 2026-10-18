'use client';

import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { OrderPermitLink } from '@/components/order-management/customs-link/OrderPermitLink';
import { trpc } from '@/lib/trpc';

export default function Page() {
  const records = trpc.orderManagement.customs.list.useQuery({ take: 100 });
  return (
    <div className="space-y-6">
      <PageHeader title="Permits" description="Permit records linked to order customs processing" />
      <OrderPermitLink
        title="Permit records"
        value={records.isLoading ? '…' : records.data?.length ?? '—'}
        hint={records.error?.message}
      />
    </div>
  );
}
