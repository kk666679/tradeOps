import { WmsCrudSurface } from '@/app/(app)/wms/_components/WmsCrudSurface';
import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { TwinMovementLayer } from '@/components/digital-twin/zones/TwinMovementLayer';

export const metadata: Metadata = { title: 'Logistics & Distribution' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Logistics & Distribution" description="Shipments, routes, and carrier management" />
      <TwinMovementLayer />
      <WmsCrudSurface resource="outbound" title="logistics records" />
    </div>
  );
}