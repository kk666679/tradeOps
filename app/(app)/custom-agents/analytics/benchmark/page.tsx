import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentBenchmarkTable } from '@/components/custom-agents/analytics';

export const metadata: Metadata = { title: 'Benchmark' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Benchmark" description="Route: /custom-agents/analytics/benchmark" />
      <AgentBenchmarkTable />
    </div>
  );
}
