import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentAutomationRate } from '@/components/custom-agents/analytics';

export const metadata: Metadata = { title: 'Automation' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Automation" description="Route: /custom-agents/analytics/automation" />
      <AgentAutomationRate />
    </div>
  );
}
