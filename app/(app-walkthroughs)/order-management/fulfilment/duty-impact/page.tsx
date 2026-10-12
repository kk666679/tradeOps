'use client';

import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { DutyImpactPreview } from '@/components/order-management/fulfilment/DutyImpactPreview';
import { trpc } from '@/lib/trpc';

export default function Page() {
  const orders = trpc.orderManagement.fulfilment.list.useQuery({ take: 100 });
  const totalDutyImpact = (orders.data ?? []).reduce(
    (total: number, record: any) => total + (typeof record.dutyImpact === 'number' ? record.dutyImpact : 0),
    0,
  );
  const hasDutyImpact = (orders.data ?? []).some((record: any) => typeof record.dutyImpact === 'number');
  return (
    <div className="space-y-6">
      <PageHeader title="Duty Impact" description="Review recorded duty impact across fulfilment orders" />
      <DutyImpactPreview
        title="Recorded duty impact"
        value={orders.isLoading ? '…' : hasDutyImpact ? totalDutyImpact.toLocaleString() : '—'}
        hint={orders.error?.message}
      />
    </div>
  );
}
