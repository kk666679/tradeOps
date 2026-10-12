import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentAutomationRate } from '@/components/custom-agents/analytics/AgentAutomationRate';
import { AgentBenchmarkTable } from '@/components/custom-agents/analytics/AgentBenchmarkTable';
import { AgentExceptionPareto } from '@/components/custom-agents/analytics/AgentExceptionPareto';
import { AgentRoiCard } from '@/components/custom-agents/analytics/AgentRoiCard';
import { AgentThroughputChart } from '@/components/custom-agents/analytics/AgentThroughputChart';

export const metadata: Metadata = { title: 'Agent Analytics' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Agent Analytics" description="Automation rate, benchmarks, exceptions, ROI, and throughput" />
      <AgentRoiCard />
      <div className="grid gap-6 lg:grid-cols-2">
        <AgentAutomationRate />
        <AgentThroughputChart />
      </div>
      <AgentBenchmarkTable />
      <AgentExceptionPareto />
    </div>
  );
}