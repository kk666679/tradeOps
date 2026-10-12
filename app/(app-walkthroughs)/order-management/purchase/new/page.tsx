'use client';

import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { PurchaseOrderForm } from '@/components/order-management/purchase/PurchaseOrderForm';
import { trpc } from '@/lib/trpc';

export default function Page() {
  const create = trpc.orderManagement.purchase.create.useMutation();
  async function submit(values: Record<string, unknown>) {
    const ref = String(values.ref ?? '').trim();
    if (!ref) return;
    await create.mutateAsync({ ref, metadata: { form: 'purchase-order', values } }).catch(() => undefined);
  }
  return (
    <div className="space-y-6">
      <PageHeader title="New Purchase Order" description="Create a purchase order" />
      <PurchaseOrderForm onSubmit={submit} submitting={create.isPending} />
      {create.error ? <p className="text-sm text-destructive">{create.error.message}</p> : null}
    </div>
  );
}
