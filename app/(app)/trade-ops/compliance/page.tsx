import type { Metadata } from 'next';
import { TradeOpsListView } from '@/components/trade-ops/TradeOpsListView';

export const metadata: Metadata = { title: 'Compliance' };

export default function Page() {
  return (
    <TradeOpsListView
      procedure="compliance"
      config={{
        title: 'Compliance',
        description: 'Review screening, valuation, origin, and bottleneck findings.',
        empty: 'No compliance findings have been recorded yet.',
        columns: ['severity', 'kind', 'message', 'resolvedAt', 'resolvedBy'],
      }}
    />
  );
}
