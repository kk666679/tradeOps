import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentComplianceReport } from '@/components/custom-agents/audit';

export const metadata: Metadata = { title: 'Compliance' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Compliance" description="Route: /custom-agents/audit/compliance" />
      <AgentComplianceReport />
    </div>
  );
}
