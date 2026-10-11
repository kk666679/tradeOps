import type { Metadata } from 'next';
import { TradeOpsListView } from '@/components/trade-ops/TradeOpsListView';

export const metadata: Metadata = { title: 'Rulings' };

export default function Page() {
  return (
    <TradeOpsListView
      procedure="hsCodeRulings"
      config={{
        title: 'Rulings',
        description: 'Browse binding and advance rulings issued for HS codes.',
        empty: 'No rulings have been recorded yet.',
        columns: ['rulingRef', 'kind', 'authority', 'issuedAt', 'validTo', 'status'],
      }}
    />
  );
}
