import type { Metadata } from 'next';
import { TradeOpsCreatePage, type TradeOpsFieldConfig } from '@/components/trade-ops/TradeOpsCreatePage';

export const metadata: Metadata = { title: 'Upload Document' };

const fields: TradeOpsFieldConfig[] = [
  { key: 'title', label: 'Title', required: true },
  {
    key: 'kind',
    label: 'Kind',
    type: 'select',
    options: ['BOL', 'INVOICE', 'PACKING_LIST', 'CERTIFICATE_OF_ORIGIN', 'CUSTOMS_FORM', 'PERMIT', 'INSURANCE', 'INSPECTION', 'OTHER'],
  },
  { key: 'url', label: 'URL' },
  { key: 'mimeType', label: 'MIME type' },
  { key: 'sizeBytes', label: 'Size (bytes)', type: 'number' },
  { key: 'sha256', label: 'SHA-256' },
  { key: 'declarationId', label: 'Declaration ID' },
  { key: 'cargoId', label: 'Cargo ID' },
];

export default function Page() {
  return (
    <TradeOpsCreatePage
      resource="documents"
      title="Upload document"
      description="Register a trade document for a declaration or cargo movement."
      backHref="/trade-ops/documents"
      fields={fields}
    />
  );
}