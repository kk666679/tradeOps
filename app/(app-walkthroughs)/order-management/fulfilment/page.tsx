import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { OrderWorkbench } from '@/components/ai-composites/orders/order-workbench';

export const metadata: Metadata = { title: 'Fulfilment' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Fulfilment" description="Order fulfilment planning, duty impact, and routing" />
      <OrderWorkbench />
    </div>
  );
}