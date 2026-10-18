import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentExplainabilityPanel } from '@/components/custom-agents/supervision';

export const metadata: Metadata = { title: 'Explainability' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Explainability" description="Route: /custom-agents/supervision/explainability" />
      <AgentExplainabilityPanel />
    </div>
  );
}
