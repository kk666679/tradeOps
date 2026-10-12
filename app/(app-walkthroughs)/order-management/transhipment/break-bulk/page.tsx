'use client';

import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { BreakBulkOrderForm } from '@/components/order-management/transhipment/BreakBulkOrderForm';
import { trpc } from '@/lib/trpc';

export default function Page() {
  const create = trpc.fcz.breakBulk.create.useMutation();
  async function submit(values: Record<string, unknown>) {
    const ref = String(values.ref ?? '').trim();
    if (!ref) return;
    await create.mutateAsync({ ref, metadata: { form: 'break-bulk', values } }).catch(() => undefined);
  }
  return (
    <div className="space-y-6">
      <PageHeader title="Break Bulk" description="Create a break-bulk transhipment order" />
      <BreakBulkOrderForm onSubmit={submit} submitting={create.isPending} />
      {create.error ? <p className="text-sm text-destructive">{create.error.message}</p> : null}
    </div>
  );
}
