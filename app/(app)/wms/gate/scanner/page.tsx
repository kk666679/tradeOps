import { WmsCrudSurface } from '@/app/(app)/wms/_components/WmsCrudSurface';
import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { GatePassScanner } from '@/components/wms/gate/GatePassScanner';

export const metadata: Metadata = { title: 'Gate Scanner' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Gate Scanner" description="Pass and seal verification scanning" />
      <GatePassScanner />
      <WmsCrudSurface resource="gate" title="gate scanner records" />
    </div>
  );
}