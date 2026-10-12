import type { Metadata } from 'next';
import { TradeOpsListView } from '@/components/trade-ops/TradeOpsListView';

export const metadata: Metadata = { title: 'Declarations' };

export default function Page() {
  return (
    <TradeOpsListView
      procedure="declarations"
      config={{
        title: 'Declarations',
        description: 'Prepare, submit, and track customs declarations.',
        createHref: '/trade-ops/declarations/new',
        empty: 'No declarations have been created yet.',
        detailHref: '/trade-ops/declarations',
        columns: ['ref', 'status', 'regime', 'channel', 'totalValue'],
      }}
    />
  );
}
