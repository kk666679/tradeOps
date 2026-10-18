import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentSuccessRateChart } from '@/components/custom-agents/monitoring';

export const metadata: Metadata = { title: 'Success Rate' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Success Rate" description="Route: /custom-agents/monitoring/success-rate" />
      <AgentSuccessRateChart />
    </div>
  );
}
