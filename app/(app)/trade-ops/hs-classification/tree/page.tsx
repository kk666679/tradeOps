import type { Metadata } from 'next';
import { TradeOpsListView } from '@/components/trade-ops/TradeOpsListView';

export const metadata: Metadata = { title: 'HS Tree' };

export default function Page() {
  return (
    <TradeOpsListView
      procedure="hsClassification"
      config={{
        title: 'HS Tree',
        description: 'Browse the harmonised system code hierarchy and its parent/child links.',
        empty: 'No HS codes have been recorded yet.',
        columns: ['code', 'parentCode', 'chapter', 'heading', 'description', 'dutyRate'],
      }}
    />
  );
}
