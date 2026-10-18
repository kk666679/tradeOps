import { WmsCrudSurface } from '@/app/(app)/wms/_components/WmsCrudSurface';
import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { ExemptionTimeline } from '@/components/ai-composites/wms/exemption-timeline';

export const metadata: Metadata = { title: 'Exemption Reconciliation' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Exemption Reconciliation" description="Reconcile exemption claims with actuals" />
      <ExemptionTimeline />
      <WmsCrudSurface resource="exemption" title="exemption reconciliation records" />
    </div>
  );
}