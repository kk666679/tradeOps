import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentSlaBoard } from '@/components/custom-agents/monitoring';

export const metadata: Metadata = { title: 'Sla' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Sla" description="Route: /custom-agents/monitoring/sla" />
      <AgentSlaBoard />
    </div>
  );
}
