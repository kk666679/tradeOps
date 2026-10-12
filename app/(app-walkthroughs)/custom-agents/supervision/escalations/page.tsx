import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentEscalationInbox } from '@/components/custom-agents/supervision';

export const metadata: Metadata = { title: 'Escalations' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Escalations" description="Route: /custom-agents/supervision/escalations" />
      <AgentEscalationInbox />
    </div>
  );
}
