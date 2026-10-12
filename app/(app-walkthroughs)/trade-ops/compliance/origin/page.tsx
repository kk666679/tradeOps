import type { Metadata } from 'next';
import { TradeOpsListView } from '@/components/trade-ops/TradeOpsListView';

export const metadata: Metadata = { title: 'Origin' };

export default function Page() {
  return (
    <TradeOpsListView
      procedure="compliance"
      config={{
        title: 'Origin',
        description: 'Review origin determinations and the rules applied to declarations.',
        empty: 'No origin findings have been recorded yet.',
        filter: { field: 'kind', value: 'origin' },
        columns: ['severity', 'kind', 'message', 'resolvedAt'],
      }}
    />
  );
}
