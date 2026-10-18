import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentQueueBoard } from '@/components/custom-agents/orchestration';

export const metadata: Metadata = { title: 'Queue' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Queue" description="Route: /custom-agents/orchestration/queue" />
      <AgentQueueBoard />
    </div>
  );
}
