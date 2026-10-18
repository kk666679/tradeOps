import type { Metadata } from 'next';
import { TradeOpsListView } from '@/components/trade-ops/TradeOpsListView';

export const metadata: Metadata = { title: 'Permits' };

export default function Page() {
  return (
    <TradeOpsListView
      procedure="permits"
      config={{
        title: 'Permits',
        description: 'Track applications, approvals, and expiries across authorities.',
        createHref: '/trade-ops/permits/new',
        empty: 'No permits have been recorded yet.',
        detailHref: '/trade-ops/permits',
        columns: ['ref', 'status', 'authority', 'validTo'],
      }}
    />
  );
}
