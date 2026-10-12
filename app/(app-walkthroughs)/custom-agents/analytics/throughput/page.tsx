import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentThroughputChart } from '@/components/custom-agents/analytics';

export const metadata: Metadata = { title: 'Throughput' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Throughput" description="Route: /custom-agents/analytics/throughput" />
      <AgentThroughputChart />
    </div>
  );
}
