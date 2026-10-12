import type { Metadata } from 'next';
import { TradeOpsDetailView } from '@/components/trade-ops/TradeOpsDetailView';

export const metadata: Metadata = { title: 'Trade Finance' };

export default function Page({ params }: { params: { id: string } }) {
  return (
    <TradeOpsDetailView
      procedure="tradeFinance"
      id={params.id}
      config={{
        title: 'Trade finance record',
        description: 'Inspect the drawback claim, its amount, and its lifecycle.',
        backHref: '/trade-ops/trade-finance',
        fields: [
          { key: 'ref', label: 'Reference' },
          { key: 'status', label: 'Status' },
          { key: 'amount', label: 'Amount' },
          { key: 'currency', label: 'Currency' },
          { key: 'submittedAt', label: 'Submitted at' },
          { key: 'decidedAt', label: 'Decided at' },
          { key: 'declarationId', label: 'Declaration' },
        ],
      }}
    />
  );
}
