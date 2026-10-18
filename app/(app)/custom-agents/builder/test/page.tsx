import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentTestBench } from '@/components/custom-agents/builder';

export const metadata: Metadata = { title: 'Test' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Test" description="Route: /custom-agents/builder/test" />
      <AgentTestBench />
    </div>
  );
}
