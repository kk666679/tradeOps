import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { DutyOptimizationAgent } from '@/components/custom-agents/customs-agents';

export const metadata: Metadata = { title: 'Duty' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Duty" description="Route: /custom-agents/customs-agents/duty" />
      <DutyOptimizationAgent />
    </div>
  );
}
