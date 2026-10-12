import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentRegistry } from '@/components/custom-agents/registry/AgentRegistry';
import { AgentRegistrySearch } from '@/components/custom-agents/registry/AgentRegistrySearch';
import { AgentFleetDashboard } from '@/components/custom-agents/monitoring/AgentFleetDashboard';
import { AgentHealthGrid } from '@/components/custom-agents/monitoring/AgentHealthGrid';
import { AgentLatencyChart } from '@/components/custom-agents/monitoring/AgentLatencyChart';
import { AgentSuccessRateChart } from '@/components/custom-agents/monitoring/AgentSuccessRateChart';
import { AgentCostMeter } from '@/components/custom-agents/monitoring/AgentCostMeter';
import { AgentDriftDetector } from '@/components/custom-agents/monitoring/AgentDriftDetector';
import { AgentSlaBoard } from '@/components/custom-agents/monitoring/AgentSlaBoard';
import { AgentIncidentFeed } from '@/components/custom-agents/monitoring/AgentIncidentFeed';

export const metadata: Metadata = { title: 'Custom Agents' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Custom Agents" description="Agent registry, monitoring, analytics, builder, policy, and supervision" />
      <AgentRegistrySearch />
      <AgentRegistry />
      <AgentFleetDashboard />
      <div className="grid gap-6 lg:grid-cols-2">
        <AgentHealthGrid />
        <AgentLatencyChart />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <AgentSuccessRateChart />
        <AgentCostMeter />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <AgentDriftDetector />
        <AgentSlaBoard />
      </div>
      <AgentIncidentFeed />
    </div>
  );
}