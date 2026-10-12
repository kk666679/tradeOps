'use client';

import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { ManufacturingOrderForm } from '@/components/order-management/manufacturing/ManufacturingOrderForm';
import { trpc } from '@/lib/trpc';

export default function Page() {
  const create = trpc.orderManagement.manufacturing.create.useMutation();
  async function submit(values: Record<string, unknown>) {
    const ref = String(values.ref ?? '').trim();
    if (!ref) return;
    await create.mutateAsync({ ref, metadata: { form: 'manufacturing-order', values } }).catch(() => undefined);
  }
  return (
    <div className="space-y-6">
      <PageHeader title="New Manufacturing Order" description="Create a manufacturing work order" />
      <ManufacturingOrderForm onSubmit={submit} submitting={create.isPending} />
      {create.error ? <p className="text-sm text-destructive">{create.error.message}</p> : null}
    </div>
  );
}
