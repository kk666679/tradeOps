import { WmsCrudSurface } from '@/app/(app)/wms/_components/WmsCrudSurface';
import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { WmsDashboard } from '@/components/wms/core/WmsDashboard';
import { WmsSummaryCard } from '@/components/wms/WmsSummaryCard';
import { WmsOperationsPanel } from '@/components/wms/core/WmsOperationsPanel';

export const metadata: Metadata = { title: 'WMS' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Warehouse Management" description="Inbound, outbound, inventory, and bonded operations" />
      <WmsSummaryCard />
      <WmsDashboard />
      <WmsOperationsPanel />
      <WmsCrudSurface resource="inventory" title="Inventory records" />
    </div>
  );
}