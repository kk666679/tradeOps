import type { Metadata } from 'next';
import { TradeOpsDetailView } from '@/components/trade-ops/TradeOpsDetailView';

export const metadata: Metadata = { title: 'Document' };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <TradeOpsDetailView
      procedure="documents"
      id={id}
      config={{
        title: 'Document detail',
        description: 'Inspect the trade document, its metadata, and its embedding state.',
        backHref: '/trade-ops/documents',
        fields: [
          { key: 'kind', label: 'Kind' },
          { key: 'title', label: 'Title' },
          { key: 'url', label: 'URL' },
          { key: 'mimeType', label: 'MIME type' },
          { key: 'sizeBytes', label: 'Size (bytes)' },
          { key: 'sha256', label: 'SHA-256' },
          { key: 'embedded', label: 'Embedded' },
          { key: 'embeddedAt', label: 'Embedded at' },
          { key: 'declarationId', label: 'Declaration' },
          { key: 'cargoId', label: 'Cargo' },
        ],
      }}
    />
  );
}
