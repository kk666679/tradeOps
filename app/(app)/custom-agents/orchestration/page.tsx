import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentOrchestrator } from '@/components/custom-agents/orchestration';

export const metadata: Metadata = { title: 'Orchestration' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Orchestration" description="Route: /custom-agents/orchestration" />
      <AgentOrchestrator />
    </div>
  );
}
