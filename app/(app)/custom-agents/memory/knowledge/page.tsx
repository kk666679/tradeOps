import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentKnowledgeBase } from '@/components/custom-agents/memory';

export const metadata: Metadata = { title: 'Knowledge' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Knowledge" description="Route: /custom-agents/memory/knowledge" />
      <AgentKnowledgeBase />
    </div>
  );
}
