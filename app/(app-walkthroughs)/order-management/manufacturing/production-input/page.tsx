'use client';

import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { ProductionInputIssuer } from '@/components/order-management/manufacturing/ProductionInputIssuer';
import { trpc } from '@/lib/trpc';

export default function Page() {
  const inputs = trpc.fiz.production.list.useQuery({ take: 100 });
  return (
    <div className="space-y-6">
      <PageHeader title="Production Input" description="Production inputs recorded for FIZ operations" />
      <ProductionInputIssuer
        title="Production input records"
        value={inputs.isLoading ? '…' : inputs.data?.length ?? '—'}
        hint={inputs.error?.message}
      />
    </div>
  );
}
