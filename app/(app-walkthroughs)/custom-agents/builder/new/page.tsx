import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentBuilderWizard } from '@/components/custom-agents/builder';

export const metadata: Metadata = { title: 'New' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="New" description="Route: /custom-agents/builder/new" />
      <AgentBuilderWizard onSubmit={() => undefined} />
    </div>
  );
}
