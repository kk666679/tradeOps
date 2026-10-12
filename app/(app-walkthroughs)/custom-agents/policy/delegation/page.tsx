import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { DelegationLimits } from '@/components/custom-agents/policy';

export const metadata: Metadata = { title: 'Delegation' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Delegation" description="Route: /custom-agents/policy/delegation" />
      <DelegationLimits onSubmit={() => undefined} />
    </div>
  );
}
