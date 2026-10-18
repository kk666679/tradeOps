import type { Metadata } from 'next';
import { TradeOpsListView } from '@/components/trade-ops/TradeOpsListView';

export const metadata: Metadata = { title: 'Drawback' };

export default function Page() {
  return (
    <TradeOpsListView
      procedure="tradeFinance"
      config={{
        title: 'Drawback',
        description: 'Track drawback claims, their amounts, and their approval lifecycle.',
        empty: 'No drawback claims have been recorded yet.',
        detailHref: '/trade-ops/trade-finance',
        columns: ['ref', 'status', 'amount', 'currency', 'submittedAt', 'decidedAt'],
      }}
    />
  );
}