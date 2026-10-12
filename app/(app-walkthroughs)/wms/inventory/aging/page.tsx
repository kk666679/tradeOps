import { WmsCrudSurface } from '@/app/(app-walkthroughs)/wms/_components/WmsCrudSurface';
import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { InventoryAgingReport } from '@/components/wms/inventory/InventoryAgingReport';

export const metadata: Metadata = { title: 'Inventory Aging' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Inventory Aging Report" description="Stock aging analysis and dwell time tracking" />
      <InventoryAgingReport />
      <WmsCrudSurface resource="inventory" title="inventory aging records" />
    </div>
  );
}