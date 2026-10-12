import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentProfile } from '@/components/custom-agents/registry';

export async function generateMetadata({ params }: { params: Promise<{ agentId: string }> }): Promise<Metadata> {
  const { agentId } = await params;
  return { title: agentId };
}

export default async function Page({ params }: { params: Promise<{ agentId: string }> }) {
  const { agentId } = await params;
  return (
    <div className="space-y-6">
      <PageHeader title={agentId} description="Route: /custom-agents/builder/[agentId]" />
      <AgentProfile title="Agent ID" value={agentId} />
    </div>
  );
}
