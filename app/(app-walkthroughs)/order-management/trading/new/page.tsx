'use client';

import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { TradingOrderForm } from '@/components/order-management/trading/TradingOrderForm';
import { trpc } from '@/lib/trpc';

export default function Page() {
  const create = trpc.orderManagement.trading.create.useMutation();
  async function submit(values: Record<string, unknown>) {
    const ref = String(values.ref ?? '').trim();
    if (!ref) return;
    await create.mutateAsync({ ref, metadata: { form: 'trading', values } }).catch(() => undefined);
  }
  return (
    <div className="space-y-6">
      <PageHeader title="New Trading Order" description="Create a trading order" />
      <TradingOrderForm onSubmit={submit} submitting={create.isPending} />
      {create.error ? <p className="text-sm text-destructive">{create.error.message}</p> : null}
    </div>
  );
}
