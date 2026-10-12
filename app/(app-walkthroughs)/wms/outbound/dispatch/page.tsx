import { WmsCrudSurface } from '@/app/(app)/wms/_components/WmsCrudSurface';
import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';

export const metadata: Metadata = { title: 'Outbound Dispatch' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Outbound Dispatch" description="Dispatch planning and carrier handover" />
      <WmsCrudSurface resource="outbound" title="Dispatch existing outbound orders" />
    </div>
  );
}