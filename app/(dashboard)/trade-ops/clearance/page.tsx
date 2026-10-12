import type { Metadata } from 'next';
import { TradeOpsListView } from '@/components/trade-ops/TradeOpsListView';

export const metadata: Metadata = { title: 'Clearance' };

export default function Page() {
  return (
    <TradeOpsListView
      procedure="clearance"
      config={{
        title: 'Clearance',
        description: 'Track customs clearance, inspection, and detention across declarations.',
        empty: 'No clearance records have been created yet.',
        detailHref: '/trade-ops/clearance',
        columns: ['channel', 'releasedAt', 'detentionFrom', 'detentionTo', 'inspectionAt', 'officer'],
      }}
    />
  );
}
