import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { AgentEvidencePack } from '@/components/custom-agents/audit';

export const metadata: Metadata = { title: 'Evidence' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Evidence" description="Route: /custom-agents/audit/evidence" />
      <AgentEvidencePack />
    </div>
  );
}
