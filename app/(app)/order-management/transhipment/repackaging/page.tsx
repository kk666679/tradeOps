'use client';

import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { RepackagingOrderForm } from '@/components/order-management/transhipment/RepackagingOrderForm';
import { trpc } from '@/lib/trpc';

export default function Page() {
  const create = trpc.orderManagement.transhipment.create.useMutation();
  async function submit(values: Record<string, unknown>) {
    const ref = String(values.ref ?? '').trim();
    if (!ref) return;
    await create.mutateAsync({ ref, metadata: { form: 'repackaging', values } }).catch(() => undefined);
  }
  return (
    <div className="space-y-6">
      <PageHeader title="Repackaging" description="Create a repackaging transhipment order" />
      <RepackagingOrderForm onSubmit={submit} submitting={create.isPending} />
      {create.error ? <p className="text-sm text-destructive">{create.error.message}</p> : null}
    </div>
  );
}
