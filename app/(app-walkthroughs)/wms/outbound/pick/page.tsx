import { WmsCrudSurface } from '@/app/(app)/wms/_components/WmsCrudSurface';
import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { OutboundPickList } from '@/components/wms/outbound/OutboundPickList';

export const metadata: Metadata = { title: 'Outbound Picking' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Outbound Picking" description="Pick list management and execution" />
      <OutboundPickList />
      <WmsCrudSurface resource="outbound" title="outbound pick records" />
    </div>
  );
}