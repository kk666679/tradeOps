import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentDriftDetector } from '@/components/custom-agents/monitoring';

export const metadata: Metadata = { title: 'Drift' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Drift" description="Route: /custom-agents/monitoring/drift" />
      <AgentDriftDetector />
    </div>
  );
}
