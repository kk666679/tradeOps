import type { Metadata } from 'next';
import { TradeOpsListView } from '@/components/trade-ops/TradeOpsListView';

export const metadata: Metadata = { title: 'Documents' };

export default function Page() {
  return (
    <TradeOpsListView
      procedure="documents"
      config={{
        title: 'Documents',
        description: 'Keep the documents required for compliant movement of goods.',
        createHref: '/trade-ops/documents/upload',
        empty: 'No trade documents have been uploaded yet.',
        detailHref: '/trade-ops/documents',
        columns: ['kind', 'title', 'embedded', 'mimeType'],
      }}
    />
  );
}
