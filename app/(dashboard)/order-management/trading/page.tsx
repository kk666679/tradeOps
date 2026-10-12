import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { TradingMatchView } from '@/components/ai-composites/orders/trading-match-view';

export const metadata: Metadata = { title: 'Trading Orders' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Trading Orders" description="Entreprôt trading, matching, and settlement" />
      <TradingMatchView />
    </div>
  );
}