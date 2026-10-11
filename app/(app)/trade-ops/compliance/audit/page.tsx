import type { Metadata } from 'next';
import { TradeOpsListView } from '@/components/trade-ops/TradeOpsListView';

export const metadata: Metadata = { title: 'Audit' };

export default function Page() {
  return (
    <TradeOpsListView
      procedure="compliance"
      config={{
        title: 'Audit',
        description: 'Review compliance audit findings raised against declarations.',
        empty: 'No audit findings have been recorded yet.',
        filter: { field: 'kind', value: 'audit' },
        columns: ['severity', 'kind', 'message', 'resolvedAt', 'resolvedBy'],
      }}
    />
  );
}
