import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { ClearanceFollowUpAgent } from '@/components/custom-agents/customs-agents';

export const metadata: Metadata = { title: 'Clearance' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Clearance" description="Route: /custom-agents/customs-agents/clearance" />
      <ClearanceFollowUpAgent />
    </div>
  );
}
