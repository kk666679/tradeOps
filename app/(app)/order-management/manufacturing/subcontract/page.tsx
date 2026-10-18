'use client';

import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { SubcontractOrderForm } from '@/components/order-management/manufacturing/SubcontractOrderForm';
import { trpc } from '@/lib/trpc';

export default function Page() {
  const create = trpc.fiz.subcontract.create.useMutation();
  async function submit(values: Record<string, unknown>) {
    const ref = String(values.ref ?? '').trim();
    if (!ref) return;
    await create.mutateAsync({ ref, metadata: { form: 'subcontract-order', values } }).catch(() => undefined);
  }
  return (
    <div className="space-y-6">
      <PageHeader title="Subcontract Order" description="Create a subcontract work order" />
      <SubcontractOrderForm onSubmit={submit} submitting={create.isPending} />
      {create.error ? <p className="text-sm text-destructive">{create.error.message}</p> : null}
    </div>
  );
}
