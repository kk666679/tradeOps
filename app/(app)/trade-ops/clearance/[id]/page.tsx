import type { Metadata } from 'next';
import { TradeOpsDetailView } from '@/components/trade-ops/TradeOpsDetailView';

export const metadata: Metadata = { title: 'Clearance' };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <TradeOpsDetailView
      procedure="clearance"
      id={id}
      config={{
        title: 'Clearance record',
        description: 'Inspect the clearance, detention, and inspection timeline for a declaration.',
        backHref: '/trade-ops/clearance',
        fields: [
          { key: 'channel', label: 'Channel' },
          { key: 'releasedAt', label: 'Released at' },
          { key: 'detentionFrom', label: 'Detention from' },
          { key: 'detentionTo', label: 'Detention to' },
          { key: 'inspectionAt', label: 'Inspection at' },
          { key: 'officer', label: 'Officer' },
          { key: 'notes', label: 'Notes' },
          { key: 'declarationId', label: 'Declaration' },
        ],
      }}
    />
  );
}
