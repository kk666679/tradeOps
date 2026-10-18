import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentApprovalGate } from '@/components/custom-agents/supervision';

export const metadata: Metadata = { title: 'Approvals' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Approvals" description="Route: /custom-agents/supervision/approvals" />
      <AgentApprovalGate />
    </div>
  );
}
