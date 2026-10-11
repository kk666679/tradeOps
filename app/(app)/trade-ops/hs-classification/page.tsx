import type { Metadata } from 'next';
import { TradeOpsListView } from '@/components/trade-ops/TradeOpsListView';

export const metadata: Metadata = { title: 'HS Classification' };

export default function Page() {
  return (
    <TradeOpsListView
      procedure="hsClassification"
      config={{
        title: 'HS Classification',
        description: 'Browse the harmonised system code tree and its duty rates.',
        empty: 'No HS codes have been recorded yet.',
        columns: ['code', 'chapter', 'heading', 'description', 'kind', 'status', 'dutyRate'],
      }}
    />
  );
}
