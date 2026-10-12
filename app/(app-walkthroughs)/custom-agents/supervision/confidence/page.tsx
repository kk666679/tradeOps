import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentConfidenceGauge } from '@/components/custom-agents/supervision';

export const metadata: Metadata = { title: 'Confidence' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Confidence" description="Route: /custom-agents/supervision/confidence" />
      <AgentConfidenceGauge />
    </div>
  );
}
