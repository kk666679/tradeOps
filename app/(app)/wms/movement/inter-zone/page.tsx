import { WmsCrudSurface } from '@/app/(app)/wms/_components/WmsCrudSurface';
import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { TwinMovementLayer } from '@/components/workflow-studio/digital-twin/zones/TwinMovementLayer';

export const metadata: Metadata = { title: 'Inter-Zone Movements' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Inter-Zone Movements" description="Manage and track movements between warehouse zones" />
      <TwinMovementLayer />
      <WmsCrudSurface resource="movement" title="movement inter-zone records" allowCreate />
    </div>
  );
}