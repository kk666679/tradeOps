import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentMeshGateway } from '@/components/integration/AgentMeshGateway';

export const metadata: Metadata = { title: 'Agent Mesh Integration' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Agent Mesh Integration" description="Agent mesh gateway for heartbeat, topology, and skills" />
      <AgentMeshGateway />
    </div>
  );
}