import type { Metadata } from 'next';
import { TradeOpsCreatePage, type TradeOpsFieldConfig } from '@/components/trade-ops/TradeOpsCreatePage';

export const metadata: Metadata = { title: 'New Declaration' };

const fields: TradeOpsFieldConfig[] = [
  { key: 'ref', label: 'Reference', required: true, placeholder: 'DEC-2026-0001' },
  { key: 'declarationType', label: 'Type', placeholder: 'IM, EX, TR' },
  {
    key: 'regime',
    label: 'Regime',
    type: 'select',
    options: ['FIZ', 'FCZ', 'BONDED', 'FTZ'],
  },
  {
    key: 'channel',
    label: 'Channel',
    type: 'select',
    options: ['GREEN', 'YELLOW', 'RED'],
  },
  { key: 'declarantName', label: 'Declarant name' },
  { key: 'consigneeName', label: 'Consignee name' },
  { key: 'notifyName', label: 'Notify party' },
  { key: 'origin', label: 'Origin' },
  { key: 'destination', label: 'Destination' },
  { key: 'currency', label: 'Currency', defaultValue: 'MYR' },
  { key: 'totalValue', label: 'Total value', type: 'number' },
  { key: 'totalDuty', label: 'Total duty', type: 'number' },
  { key: 'totalTax', label: 'Total tax', type: 'number' },
];

export default function Page() {
  return (
    <TradeOpsCreatePage
      resource="declarations"
      title="New declaration"
      description="Create a new customs declaration."
      backHref="/trade-ops/declarations"
      fields={fields}
    />
  );
}