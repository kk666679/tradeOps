import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { InventoryCycleCount } from '@/components/wms/inventory/InventoryCycleCount';

export const metadata: Metadata = { title: 'Cycle Count' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Cycle Count" description="Cycle counting operations and variance tracking" />
      <InventoryCycleCount />
    </div>
  );
}