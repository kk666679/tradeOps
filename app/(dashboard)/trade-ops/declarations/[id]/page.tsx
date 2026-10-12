import type { Metadata } from 'next';
import { TradeOpsDetailView } from '@/components/trade-ops/TradeOpsDetailView';

export const metadata: Metadata = { title: 'Declaration' };

export default function Page({ params }: { params: { id: string } }) {
  return (
    <TradeOpsDetailView
      procedure="declarations"
      id={params.id}
      config={{
        title: 'Declaration detail',
        description: 'Inspect the declaration, its lines, and its customs lifecycle.',
        backHref: '/trade-ops/declarations',
        fields: [
          { key: 'ref', label: 'Reference' },
          { key: 'status', label: 'Status' },
          { key: 'regime', label: 'Regime' },
          { key: 'channel', label: 'Channel' },
          { key: 'declarationType', label: 'Type' },
          { key: 'declarantName', label: 'Declarant' },
          { key: 'consigneeName', label: 'Consignee' },
          { key: 'notifyName', label: 'Notify party' },
          { key: 'origin', label: 'Origin' },
          { key: 'destination', label: 'Destination' },
          { key: 'currency', label: 'Currency' },
          { key: 'totalValue', label: 'Total value' },
          { key: 'totalDuty', label: 'Total duty' },
          { key: 'totalTax', label: 'Total tax' },
          { key: 'submittedAt', label: 'Submitted at' },
          { key: 'assessedAt', label: 'Assessed at' },
          { key: 'releasedAt', label: 'Released at' },
        ],
      }}
    />
  );
}
