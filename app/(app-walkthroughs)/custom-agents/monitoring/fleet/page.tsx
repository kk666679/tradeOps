import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentFleetDashboard } from '@/components/custom-agents/monitoring';

export const metadata: Metadata = { title: 'Fleet' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Fleet" description="Route: /custom-agents/monitoring/fleet" />
      <AgentFleetDashboard />
    </div>
  );
}
