import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { InboundDashboard } from '@/components/wms/inbound/InboundDashboard';
import { InboundReceiptList } from '@/components/wms/inbound/InboundReceiptList';
import { InboundAsnList } from '@/components/wms/inbound/InboundAsnList';
import { InboundQcPanel } from '@/components/wms/inbound/InboundQcPanel';
import { InboundPutawayPlanner } from '@/components/wms/inbound/InboundPutawayPlanner';

export const metadata: Metadata = { title: 'Inbound Operations' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Inbound Operations" description="Receipts, ASNs, QC, duty suspension, and putaway planning" />
      <InboundDashboard />
      <div className="grid gap-6 lg:grid-cols-2">
        <InboundReceiptList />
        <InboundAsnList />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <InboundQcPanel />
        <InboundPutawayPlanner />
      </div>
    </div>
  );
}