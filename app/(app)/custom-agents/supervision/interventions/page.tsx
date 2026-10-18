import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentInterventionPanel } from '@/components/custom-agents/supervision';

export const metadata: Metadata = { title: 'Interventions' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Interventions" description="Route: /custom-agents/supervision/interventions" />
      <AgentInterventionPanel />
    </div>
  );
}
