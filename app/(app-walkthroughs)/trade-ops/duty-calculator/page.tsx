import type { Metadata } from 'next';
import { TradeOpsListView } from '@/components/trade-ops/TradeOpsListView';

export const metadata: Metadata = { title: 'Duty Calculator' };

export default function Page() {
  return (
    <TradeOpsListView
      procedure="duty"
      config={{
        title: 'Duty Calculator',
        description: 'Review duty calculations generated for declarations.',
        empty: 'No duty calculations have been recorded yet.',
        columns: ['declarationId', 'method', 'assessableValue', 'currency', 'duty', 'salesTax', 'excise', 'total'],
      }}
    />
  );
}
