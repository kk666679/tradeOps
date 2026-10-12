import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentActionReplay } from '@/components/custom-agents/audit';

export const metadata: Metadata = { title: 'Replay' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Replay" description="Route: /custom-agents/audit/replay" />
      <AgentActionReplay />
    </div>
  );
}
