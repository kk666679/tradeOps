import { WmsCrudSurface } from '@/app/(app-walkthroughs)/wms/_components/WmsCrudSurface';
import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { TwinMovementLayer } from '@/components/digital-twin/zones/TwinMovementLayer';

export const metadata: Metadata = { title: 'Movement Tracking' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Movement Tracking" description="Inter-zone movements, exceptions, and real-time tracking" />
      <TwinMovementLayer />
      <WmsCrudSurface resource="movement" title="movement records" />
    </div>
  );
}