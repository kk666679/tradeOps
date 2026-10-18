import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentMemoryStore } from '@/components/custom-agents/memory';

export const metadata: Metadata = { title: 'Memory' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Memory" description="Route: /custom-agents/memory" />
      <AgentMemoryStore />
    </div>
  );
}
