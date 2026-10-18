import { WmsCrudSurface } from '@/app/(app)/wms/_components/WmsCrudSurface';
import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { InventoryHoldRelease } from '@/components/wms/inventory/InventoryHoldRelease';

export const metadata: Metadata = { title: 'Inventory Holds' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Inventory Holds" description="Hold and release management for inventory" />
      <InventoryHoldRelease />
      <WmsCrudSurface resource="inventory" title="inventory holds records" />
    </div>
  );
}