import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { OutboundOrderList } from '@/components/wms/outbound/OutboundOrderList';

export const metadata: Metadata = { title: 'New Outbound Order' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="New Outbound Order" description="Create a new outbound order" />
      <OutboundOrderList />
    </div>
  );
}