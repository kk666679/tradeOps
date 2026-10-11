import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { ExemptionTimeline } from '@/components/ai-composites/wms/exemption-timeline';

export const metadata: Metadata = { title: 'Exemption Management' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Exemption Management" description="Exemption claims, reconciliation, utilization, and clawback tracking" />
      <ExemptionTimeline />
    </div>
  );
}