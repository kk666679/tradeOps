import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentIncidentFeed } from '@/components/custom-agents/monitoring';

export const metadata: Metadata = { title: 'Incidents' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Incidents" description="Route: /custom-agents/monitoring/incidents" />
      <AgentIncidentFeed />
    </div>
  );
}
