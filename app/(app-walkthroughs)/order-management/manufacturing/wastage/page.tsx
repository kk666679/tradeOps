'use client';

import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { WastageScrapForm } from '@/components/order-management/manufacturing/WastageScrapForm';
import { trpc } from '@/lib/trpc';

export default function Page() {
  const create = trpc.fiz.wastage.create.useMutation();
  async function submit(values: Record<string, unknown>) {
    const ref = String(values.ref ?? '').trim();
    if (!ref) return;
    await create.mutateAsync({ ref, metadata: { form: 'wastage-scrap', values } }).catch(() => undefined);
  }
  return (
    <div className="space-y-6">
      <PageHeader title="Wastage and Scrap" description="Record manufacturing wastage or scrap" />
      <WastageScrapForm onSubmit={submit} submitting={create.isPending} />
      {create.error ? <p className="text-sm text-destructive">{create.error.message}</p> : null}
    </div>
  );
}
