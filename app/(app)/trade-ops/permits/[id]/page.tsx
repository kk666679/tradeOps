import type { Metadata } from 'next';
import { TradeOpsDetailView } from '@/components/trade-ops/TradeOpsDetailView';

export const metadata: Metadata = { title: 'Permit' };

export default function Page({ params }: { params: { id: string } }) {
  return (
    <TradeOpsDetailView
      procedure="permits"
      id={params.id}
      config={{
        title: 'Permit detail',
        description: 'Inspect the permit application, authority, and validity.',
        backHref: '/trade-ops/permits',
        fields: [
          { key: 'ref', label: 'Reference' },
          { key: 'status', label: 'Status' },
          { key: 'authority', label: 'Authority' },
          { key: 'validFrom', label: 'Valid from' },
          { key: 'validTo', label: 'Valid to' },
          { key: 'issuedAt', label: 'Issued at' },
          { key: 'rejectedAt', label: 'Rejected at' },
          { key: 'attachmentUrl', label: 'Attachment' },
          { key: 'definitionId', label: 'Definition' },
        ],
      }}
    />
  );
}
