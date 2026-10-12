'use client';

import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { RefundTracker } from '@/components/trade-ops/trade-finance/RefundTracker';
import { TradeOpsListView } from '@/components/trade-ops/TradeOpsListView';
import { trpc } from '@/lib/trpc/react';

export function RefundsRouteView() {
  const claims = trpc.tradeOps.tradeFinance.list.useQuery({ take: 100 });
  const rows = (claims.data ?? []) as { status?: string; amount?: number | string }[];
  const count = (statuses: string[]) =>
    rows.filter((claim) => statuses.includes(String(claim.status))).length;
  const amount = rows.reduce((total, claim) => total + (Number(claim.amount) || 0), 0);
  const value = (n: number) => claims.isLoading || claims.isError ? '—' : n;

  return (
    <div className="space-y-6">
      <PageHeader title="Refunds" description="Track refund progress using tenant-scoped drawback claim records." />
      {claims.isError ? (
        <p className="text-sm text-destructive" role="alert">Could not load refund claim metrics.</p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <RefundTracker title="Claims" value={value(rows.length)} hint="Total drawback claims" />
        <RefundTracker title="Awaiting decision" value={value(count(['DRAFT', 'SUBMITTED']))} hint="Draft or submitted claims" />
        <RefundTracker title="Paid" value={value(count(['PAID']))} hint="Claims marked paid" />
        <RefundTracker title="Claim amount" value={claims.isLoading || claims.isError ? '—' : amount.toLocaleString()} hint="Sum of recorded claim amounts" />
      </div>
      <TradeOpsListView
        procedure="tradeFinance"
        config={{
          title: 'Refund claim records',
          description: 'Drawback claims currently recorded for this tenant.',
          empty: 'No refund or drawback claims have been recorded yet.',
          detailHref: '/trade-ops/trade-finance',
          createHref: '/trade-ops/trade-finance/drawback',
          columns: ['ref', 'status', 'amount', 'currency', 'submittedAt'],
        }}
      />
    </div>
  );
}
