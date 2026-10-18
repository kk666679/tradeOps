import { WmsCrudSurface } from '@/app/(app)/wms/_components/WmsCrudSurface';
import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { OutboundPackPanel } from '@/components/wms/outbound/OutboundPackPanel';

export const metadata: Metadata = { title: 'Outbound Packing' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Outbound Packing" description="Packing stations and cartonization" />
      <OutboundPackPanel />
      <WmsCrudSurface resource="outbound" title="outbound pack records" />
    </div>
  );
}