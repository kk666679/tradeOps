import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentRunInspector } from '@/components/custom-agents/orchestration';
import { AgentProfile } from '@/components/custom-agents/registry';

export async function generateMetadata({ params }: { params: Promise<{ runId: string }> }): Promise<Metadata> {
  const { runId } = await params;
  return { title: runId };
}

export default async function Page({ params }: { params: Promise<{ runId: string }> }) {
  const { runId } = await params;
  return (
    <div className="space-y-6">
      <PageHeader title={runId} description="Route: /custom-agents/orchestration/runs/[runId]" />
      <AgentProfile title="Run ID" value={runId} />
      <AgentRunInspector />
    </div>
  );
}
