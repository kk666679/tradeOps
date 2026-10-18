'use client';

import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { ReexportOrderForm } from '@/components/order-management/transhipment/ReexportOrderForm';
import { trpc } from '@/lib/trpc';

export default function Page() {
  const create = trpc.fcz.reexport.create.useMutation();
  async function submit(values: Record<string, unknown>) {
    const ref = String(values.ref ?? '').trim();
    if (!ref) return;
    await create.mutateAsync({ ref, metadata: { form: 're-export', values } }).catch(() => undefined);
  }
  return (
    <div className="space-y-6">
      <PageHeader title="Re-export" description="Create a re-export transhipment order" />
      <ReexportOrderForm onSubmit={submit} submitting={create.isPending} />
      {create.error ? <p className="text-sm text-destructive">{create.error.message}</p> : null}
    </div>
  );
}
