'use client';

import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { TranshipmentOrderForm } from '@/components/order-management/transhipment/TranshipmentOrderForm';
import { trpc } from '@/lib/trpc';

export default function Page() {
  const create = trpc.orderManagement.transhipment.create.useMutation();
  async function submit(values: Record<string, unknown>) {
    const ref = String(values.ref ?? '').trim();
    if (!ref) return;
    await create.mutateAsync({ ref, metadata: { form: 'transhipment-order', values } }).catch(() => undefined);
  }
  return (
    <div className="space-y-6">
      <PageHeader title="New Transhipment Order" description="Create a transhipment order" />
      <TranshipmentOrderForm onSubmit={submit} submitting={create.isPending} />
      {create.error ? <p className="text-sm text-destructive">{create.error.message}</p> : null}
    </div>
  );
}
