import { WmsCrudSurface } from '@/app/(app-walkthroughs)/wms/_components/WmsCrudSurface';
import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { GateWeighbridgePanel } from '@/components/wms/gate/GateWeighbridgePanel';

export const metadata: Metadata = { title: 'Weighbridge' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Weighbridge" description="Weighbridge operations and weight capture" />
      <GateWeighbridgePanel />
      <WmsCrudSurface resource="gate" title="gate weighbridge records" />
    </div>
  );
}