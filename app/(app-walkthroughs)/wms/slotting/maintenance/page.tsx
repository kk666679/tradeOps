import { WmsCrudSurface } from '@/app/(app)/wms/_components/WmsCrudSurface';
import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { SlotAllocationCanvas } from '@/components/ai-composites/wms/slot-allocation-canvas';

export const metadata: Metadata = { title: 'Slotting Maintenance' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Slotting Maintenance" description="Slot maintenance scheduling and re-slotting operations" />
      <SlotAllocationCanvas />
      <WmsCrudSurface resource="slotting" title="slotting maintenance records" />
    </div>
  );
}