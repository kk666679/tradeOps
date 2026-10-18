import { WmsCrudSurface } from '@/app/(app)/wms/_components/WmsCrudSurface';
import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { InventoryDashboard } from '@/components/wms/inventory/InventoryDashboard';
import { InventoryList } from '@/components/wms/inventory/InventoryList';
import { InventoryDetail } from '@/components/wms/inventory/InventoryDetail';
import { InventoryAgingReport } from '@/components/wms/inventory/InventoryAgingReport';
import { InventoryBondedVsDomestic } from '@/components/wms/inventory/InventoryBondedVsDomestic';
import { InventoryCycleCount } from '@/components/wms/inventory/InventoryCycleCount';
import { InventoryHoldRelease } from '@/components/wms/inventory/InventoryHoldRelease';
import { InventoryMovementLog } from '@/components/wms/inventory/InventoryMovementLog';
import { InventorySlotSuggest } from '@/components/wms/inventory/InventorySlotSuggest';
import { InventoryValuationCard } from '@/components/wms/inventory/InventoryValuationCard';
import { ReportGenerator } from '@/components/wms/inventory/ReportGenerator';

export const metadata: Metadata = { title: 'Inventory Management' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Inventory Management" description="Stock levels, movements, aging, valuation, and reporting" />
      <InventoryDashboard />
      <div className="grid gap-6 lg:grid-cols-2">
        <InventoryList />
        <InventoryDetail />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <InventoryAgingReport />
        <InventoryBondedVsDomestic />
        <InventoryValuationCard />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <InventoryCycleCount />
        <InventoryHoldRelease />
        <InventorySlotSuggest />
      </div>
      <InventoryMovementLog />
      <ReportGenerator />
      <WmsCrudSurface resource="inventory" title="inventory records" />
    </div>
  );
}