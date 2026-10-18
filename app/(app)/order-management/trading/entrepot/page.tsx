'use client';

import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { EntrepotMatchPanel } from '@/components/order-management/trading/EntrepotMatchPanel';
import { trpc } from '@/lib/trpc';

export default function Page() {
  const matches = trpc.fcz.entrepot.list.useQuery({ take: 100 });
  return (
    <div className="space-y-6">
      <PageHeader title="Entrepot Matching" description="Current entrepot matching records" />
      <EntrepotMatchPanel
        title="Matching records"
        value={matches.isLoading ? '…' : matches.data?.length ?? '—'}
        hint={matches.error?.message}
      />
    </div>
  );
}
