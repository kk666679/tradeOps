import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentDisagreementResolver } from '@/components/custom-agents/supervision';

export const metadata: Metadata = { title: 'Disagreements' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Disagreements" description="Route: /custom-agents/supervision/disagreements" />
      <AgentDisagreementResolver />
    </div>
  );
}
