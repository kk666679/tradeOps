import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentContextInspector } from '@/components/custom-agents/memory';

export const metadata: Metadata = { title: 'Context' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Context" description="Route: /custom-agents/memory/context" />
      <AgentContextInspector />
    </div>
  );
}
