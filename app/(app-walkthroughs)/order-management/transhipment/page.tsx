import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { OrderWorkbench } from '@/components/ai-composites/orders/order-workbench';

export const metadata: Metadata = { title: 'Transhipment Orders' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Transhipment Orders" description="Transhipment order management and tracking" />
      <OrderWorkbench />
    </div>
  );
}