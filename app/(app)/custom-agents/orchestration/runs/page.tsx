import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentRunTimeline } from '@/components/custom-agents/orchestration';

export const metadata: Metadata = { title: 'Runs' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Runs" description="Route: /custom-agents/orchestration/runs" />
      <AgentRunTimeline />
    </div>
  );
}
