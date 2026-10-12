import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentWorkflowCanvas } from '@/components/custom-agents/orchestration';

export const metadata: Metadata = { title: 'Canvas' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Canvas" description="Route: /custom-agents/orchestration/canvas" />
      <AgentWorkflowCanvas />
    </div>
  );
}
