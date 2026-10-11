import type { Metadata } from 'next';
import { TradeOpsListView } from '@/components/trade-ops/TradeOpsListView';

export const metadata: Metadata = { title: 'Trade Finance' };

export default function Page() {
  return (
    <TradeOpsListView
      procedure="tradeFinance"
      config={{
        title: 'Trade Finance',
        description: 'Manage letters of credit, refunds, and drawback claims.',
        empty: 'No trade finance records have been created yet.',
        detailHref: '/trade-ops/trade-finance',
        columns: ['ref', 'status', 'amount', 'currency', 'submittedAt'],
      }}
    />
  );
}
