import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentLearningLog } from '@/components/custom-agents/memory';

export const metadata: Metadata = { title: 'Learning' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Learning" description="Route: /custom-agents/memory/learning" />
      <AgentLearningLog />
    </div>
  );
}
