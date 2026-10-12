import { WmsCrudSurface } from '@/app/(app)/wms/_components/WmsCrudSurface';
import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { SlotAllocationCanvas } from '@/components/ai-composites/wms/slot-allocation-canvas';

export const metadata: Metadata = { title: 'Slotting Grid' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Slotting Grid" description="Visual warehouse grid and slot mapping" />
      <SlotAllocationCanvas />
      <WmsCrudSurface resource="slotting" title="slotting grid records" />
    </div>
  );
}