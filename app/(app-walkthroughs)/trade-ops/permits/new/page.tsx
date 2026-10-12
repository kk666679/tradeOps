import type { Metadata } from 'next';
import { TradeOpsCreatePage, type TradeOpsFieldConfig } from '@/components/trade-ops/TradeOpsCreatePage';

export const metadata: Metadata = { title: 'New Permit' };

const fields: TradeOpsFieldConfig[] = [
  { key: 'ref', label: 'Reference', required: true, placeholder: 'PERMIT-2026-0001' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: ['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'EXPIRED', 'REVOKED'],
    defaultValue: 'DRAFT',
  },
  { key: 'authority', label: 'Authority', required: true, placeholder: 'MITI, MIDA, Customs, MAQIS, SIRIM' },
  { key: 'validFrom', label: 'Valid from' },
  { key: 'validTo', label: 'Valid to' },
  { key: 'issuedAt', label: 'Issued at' },
  { key: 'attachmentUrl', label: 'Attachment URL' },
  { key: 'definitionId', label: 'Definition ID' },
];

export default function Page() {
  return (
    <TradeOpsCreatePage
      resource="permits"
      title="New permit"
      description="Record a new permit application or approval."
      backHref="/trade-ops/permits"
      fields={fields}
    />
  );
}