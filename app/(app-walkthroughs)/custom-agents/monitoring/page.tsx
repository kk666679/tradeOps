import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentFleetDashboard } from '@/components/custom-agents/monitoring/AgentFleetDashboard';
import { AgentHealthGrid } from '@/components/custom-agents/monitoring/AgentHealthGrid';
import { AgentLatencyChart } from '@/components/custom-agents/monitoring/AgentLatencyChart';
import { AgentSuccessRateChart } from '@/components/custom-agents/monitoring/AgentSuccessRateChart';
import { AgentCostMeter } from '@/components/custom-agents/monitoring/AgentCostMeter';
import { AgentDriftDetector } from '@/components/custom-agents/monitoring/AgentDriftDetector';
import { AgentSlaBoard } from '@/components/custom-agents/monitoring/AgentSlaBoard';
import { AgentIncidentFeed } from '@/components/custom-agents/monitoring/AgentIncidentFeed';

export const metadata: Metadata = { title: 'Agent Monitoring' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Agent Monitoring" description="Fleet health, latency, success rate, cost, drift, SLA, and incidents" />
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