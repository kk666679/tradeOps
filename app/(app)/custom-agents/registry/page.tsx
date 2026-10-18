import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentRegistry } from '@/components/custom-agents/registry/AgentRegistry';
import { AgentRegistrySearch } from '@/components/custom-agents/registry/AgentRegistrySearch';
import { AgentCard } from '@/components/custom-agents/registry/AgentCard';
import { AgentProfile } from '@/components/custom-agents/registry/AgentProfile';
import { AgentCapabilityMatrix } from '@/components/custom-agents/registry/AgentCapabilityMatrix';
import { AgentDependencyGraph } from '@/components/custom-agents/registry/AgentDependencyGraph';
import { AgentVersionHistory } from '@/components/custom-agents/registry/AgentVersionHistory';

export const metadata: Metadata = { title: 'Agent Registry' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Agent Registry" description="Agent catalog, profiles, capabilities, dependencies, and versions" />
      <AgentRegistrySearch />
      <AgentRegistry />
      <div className="grid gap-6 lg:grid-cols-2">
        <AgentCapabilityMatrix />
        <AgentDependencyGraph />
      </div>
      <AgentVersionHistory />
    </div>
  );
}