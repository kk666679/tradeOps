'use client';

import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { TranshipmentManifest } from '@/components/order-management/transhipment/TranshipmentManifest';
import { trpc } from '@/lib/trpc';

export default function Page() {
  const orders = trpc.orderManagement.transhipment.list.useQuery({ take: 100 });
  const description = orders.isLoading
    ? 'Loading transhipment records'
    : `${orders.data?.length ?? 0} transhipment records`;
  return (
    <div className="space-y-6">
      <PageHeader title="Transhipment Manifest" description={description} />
      <TranshipmentManifest />
      {orders.error ? <p className="text-sm text-destructive">{orders.error.message}</p> : null}
    </div>
  );
}
