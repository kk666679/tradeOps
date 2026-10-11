import type { Metadata } from 'next';
import { TradeOpsListView } from '@/components/trade-ops/TradeOpsListView';

export const metadata: Metadata = { title: 'Letter Of Credit' };

export default function Page() {
  return (
    <TradeOpsListView
      procedure="tradeFinance"
      config={{
        title: 'Letter Of Credit',
        description: 'Track letters of credit issued against trade finance records.',
        empty: 'No letters of credit have been recorded yet.',
        detailHref: '/trade-ops/trade-finance',
        columns: ['ref', 'status', 'amount', 'currency', 'submittedAt'],
      }}
    />
  );
}