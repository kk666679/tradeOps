import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { InboundQcPanel } from '@/components/wms/inbound/InboundQcPanel';

export const metadata: Metadata = { title: 'Inbound QC' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Inbound Quality Control" description="Quality inspection and hold/release decisions" />
      <InboundQcPanel />
    </div>
  );
}