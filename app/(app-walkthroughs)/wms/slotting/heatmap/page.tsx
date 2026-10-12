import { WmsCrudSurface } from '@/app/(app-walkthroughs)/wms/_components/WmsCrudSurface';
import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { SlotAllocationCanvas } from '@/components/ai-composites/wms/slot-allocation-canvas';

export const metadata: Metadata = { title: 'Slotting Heatmap' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Slotting Heatmap" description="Warehouse utilization and density heatmap" />
      <SlotAllocationCanvas />
      <WmsCrudSurface resource="slotting" title="slotting heatmap records" />
    </div>
  );
}