import { WmsCrudSurface } from '@/app/(app-walkthroughs)/wms/_components/WmsCrudSurface';
import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { SlotAllocationCanvas } from '@/components/ai-composites/wms/slot-allocation-canvas';

export const metadata: Metadata = { title: 'Slot Allocation' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Slot Allocation" description="AI-powered slot allocation and optimization" />
      <SlotAllocationCanvas />
      <WmsCrudSurface resource="slotting" title="slotting allocation records" />
    </div>
  );
}