import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { PermitSourcingAgent } from '@/components/custom-agents/customs-agents';

export const metadata: Metadata = { title: 'Permits' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Permits" description="Route: /custom-agents/customs-agents/permits" />
      <PermitSourcingAgent />
    </div>
  );
}
