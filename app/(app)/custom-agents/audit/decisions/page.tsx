import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentDecisionLog } from '@/components/custom-agents/audit';

export const metadata: Metadata = { title: 'Decisions' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Decisions" description="Route: /custom-agents/audit/decisions" />
      <AgentDecisionLog />
    </div>
  );
}
