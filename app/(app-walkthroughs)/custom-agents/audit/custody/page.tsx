import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentChainOfCustody } from '@/components/custom-agents/audit';

export const metadata: Metadata = { title: 'Custody' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Custody" description="Route: /custom-agents/audit/custody" />
      <AgentChainOfCustody />
    </div>
  );
}
