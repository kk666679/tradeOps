import type { Metadata } from 'next';
import { TradeOpsListView } from '@/components/trade-ops/TradeOpsListView';

export const metadata: Metadata = { title: 'Screening' };

export default function Page() {
  return (
    <TradeOpsListView
      procedure="compliance"
      config={{
        title: 'Screening',
        description: 'Review screening findings raised against declarations.',
        empty: 'No screening findings have been recorded yet.',
        columns: ['severity', 'kind', 'message', 'resolvedAt', 'resolvedBy'],
      }}
    />
  );
}
