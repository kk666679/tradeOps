import { WmsCrudSurface } from '@/app/(app-walkthroughs)/wms/_components/WmsCrudSurface';
import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';

export const metadata: Metadata = { title: 'Bonded Transfer' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Bonded Transfer" description="Inter-bonded warehouse transfers" />
      <WmsCrudSurface resource="movement" title="Bonded transfer movements" allowCreate />
    </div>
  );
}