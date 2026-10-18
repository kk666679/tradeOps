import { WmsCrudSurface } from '@/app/(app)/wms/_components/WmsCrudSurface';
import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { TwinMovementLayer } from '@/components/workflow-studio/digital-twin/zones/TwinMovementLayer';

export const metadata: Metadata = { title: 'Movement Tracker' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Movement Tracker" description="Real-time movement tracking and monitoring" />
      <TwinMovementLayer />
      <WmsCrudSurface resource="movement" title="movement tracker records" />
    </div>
  );
}