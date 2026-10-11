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
    </div>
  );
}