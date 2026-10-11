import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { TradeOpsAnalyticsView } from '@/components/trade-ops/TradeOpsAnalyticsView';

export const metadata: Metadata = { title: 'Analytics' };

export default function Page() {
  return (
    <>
      <PageHeader title="Analytics" description="Trade-ops aggregates across declarations, clearance, and compliance." />
      <TradeOpsAnalyticsView />
    </>
  );
}