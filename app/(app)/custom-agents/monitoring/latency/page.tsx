import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentLatencyChart } from '@/components/custom-agents/monitoring';

export const metadata: Metadata = { title: 'Latency' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Latency" description="Route: /custom-agents/monitoring/latency" />
      <AgentLatencyChart />
    </div>
  );
}
