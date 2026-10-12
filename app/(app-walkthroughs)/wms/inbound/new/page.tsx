import { WmsCrudSurface } from '@/app/(app-walkthroughs)/wms/_components/WmsCrudSurface';
import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';

export const metadata: Metadata = { title: 'New Inbound Receipt' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="New Inbound Receipt" description="Create a new inbound receipt record" />
      <WmsCrudSurface resource="inbound" title="Inbound receipts" allowCreate />
    </div>
  );
}