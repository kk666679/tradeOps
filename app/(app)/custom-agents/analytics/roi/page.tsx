import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentRoiCard } from '@/components/custom-agents/analytics';

export const metadata: Metadata = { title: 'Roi' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Roi" description="Route: /custom-agents/analytics/roi" />
      <AgentRoiCard />
    </div>
  );
}
