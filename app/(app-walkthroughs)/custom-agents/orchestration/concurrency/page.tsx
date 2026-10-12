import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentConcurrencyMeter } from '@/components/custom-agents/orchestration';

export const metadata: Metadata = { title: 'Concurrency' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Concurrency" description="Route: /custom-agents/orchestration/concurrency" />
      <AgentConcurrencyMeter />
    </div>
  );
}
