import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FizEntityList } from '../_components/FizRouteViews';

export const metadata: Metadata = { title: 'Subcontracting' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Subcontracting" description="Subcontractor management and work orders" />
      <FizEntityList kind="subcontract" />
    </div>
  );
}