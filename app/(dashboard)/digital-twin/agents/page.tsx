import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { TwinAgentList } from '@/components/digital-twin/agents/TwinAgentList';
import { TwinAgentInspector } from '@/components/digital-twin/agents/TwinAgentInspector';

export const metadata: Metadata = { title: 'Digital Twin Agents' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Digital Twin Agents" description="AI agent registry, runs, and handoff visualization" />
      <TwinAgentList />
      <TwinAgentInspector />
    </div>
  );
}