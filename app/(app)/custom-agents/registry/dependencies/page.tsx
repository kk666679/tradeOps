import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentDependencyGraph } from '@/components/custom-agents/registry';

export const metadata: Metadata = { title: 'Dependencies' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Dependencies" description="Route: /custom-agents/registry/dependencies" />
      <AgentDependencyGraph />
    </div>
  );
}
