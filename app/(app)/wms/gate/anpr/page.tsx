import { WmsCrudSurface } from '@/app/(app)/wms/_components/WmsCrudSurface';
import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { GateAnprFeed } from '@/components/wms/gate/GateAnprFeed';

export const metadata: Metadata = { title: 'ANPR Feed' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="ANPR Feed" description="Automatic number plate recognition feed" />
      <GateAnprFeed />
      <WmsCrudSurface resource="gate" title="gate anpr records" />
    </div>
  );
}