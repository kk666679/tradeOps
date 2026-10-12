import { WmsCrudSurface } from '@/app/(app)/wms/_components/WmsCrudSurface';
import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { OutboundDashboard } from '@/components/wms/outbound/OutboundDashboard';
import { OutboundOrderList } from '@/components/wms/outbound/OutboundOrderList';
import { OutboundPickList } from '@/components/wms/outbound/OutboundPickList';
import { OutboundPackPanel } from '@/components/wms/outbound/OutboundPackPanel';
import { OutboundCustomsLink } from '@/components/wms/outbound/OutboundCustomsLink';
import { OutboundDutyCalculator } from '@/components/wms/outbound/OutboundDutyCalculator';

export const metadata: Metadata = { title: 'Outbound Operations' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Outbound Operations" description="Orders, picking, packing, dispatch, customs, and duty" />
      <OutboundDashboard />
      <div className="grid gap-6 lg:grid-cols-2">
        <OutboundOrderList />
        <OutboundPickList />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <OutboundPackPanel />
        <OutboundCustomsLink />
      </div>
      <OutboundDutyCalculator />
      <WmsCrudSurface resource="outbound" title="Outbound orders" />
    </div>
  );
}