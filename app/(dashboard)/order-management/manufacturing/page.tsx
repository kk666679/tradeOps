import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { ManufacturingRunStream } from '@/components/ai-composites/orders/manufacturing-run-stream';

export const metadata: Metadata = { title: 'Manufacturing Orders' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Manufacturing Orders" description="Production planning, work orders, and run tracking" />
      <ManufacturingRunStream />
    </div>
  );
}