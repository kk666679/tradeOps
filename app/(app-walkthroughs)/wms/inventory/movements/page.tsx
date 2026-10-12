import { WmsCrudSurface } from '@/app/(app-walkthroughs)/wms/_components/WmsCrudSurface';
import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { InventoryMovementLog } from '@/components/wms/inventory/InventoryMovementLog';

export const metadata: Metadata = { title: 'Inventory Movements' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Inventory Movements" description="Complete movement history and audit trail" />
      <InventoryMovementLog />
      <WmsCrudSurface resource="movement" title="inventory movements records" />
    </div>
  );
}