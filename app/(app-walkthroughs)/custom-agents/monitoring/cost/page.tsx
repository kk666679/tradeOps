import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentCostMeter } from '@/components/custom-agents/monitoring';

export const metadata: Metadata = { title: 'Cost' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Cost" description="Route: /custom-agents/monitoring/cost" />
      <AgentCostMeter />
    </div>
  );
}
