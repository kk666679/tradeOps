import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentAuditTrail } from '@/components/custom-agents/audit';

export const metadata: Metadata = { title: 'Audit' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Audit" description="Route: /custom-agents/audit" />
      <AgentAuditTrail />
    </div>
  );
}
