import type { Metadata } from 'next';
import { TradeOpsListView } from '@/components/trade-ops/TradeOpsListView';

export const metadata: Metadata = { title: 'Detention' };

export default function Page() {
  return (
    <TradeOpsListView
      procedure="clearance"
      config={{
        title: 'Detention',
        description: 'Review declarations held in detention with open windows.',
        empty: 'No detention records have been recorded yet.',
        columns: ['channel', 'detentionFrom', 'detentionTo', 'releasedAt', 'officer'],
      }}
    />
  );
}
