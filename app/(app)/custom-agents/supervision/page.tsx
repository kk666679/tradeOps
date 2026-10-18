import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentSupervisorConsole } from '@/components/custom-agents/supervision';

export const metadata: Metadata = { title: 'Supervision' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Supervision" description="Route: /custom-agents/supervision" />
      <AgentSupervisorConsole />
    </div>
  );
}
