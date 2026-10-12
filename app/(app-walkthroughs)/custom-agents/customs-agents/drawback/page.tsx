import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { DrawbackRecoveryAgent } from '@/components/custom-agents/customs-agents';

export const metadata: Metadata = { title: 'Drawback' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Drawback" description="Route: /custom-agents/customs-agents/drawback" />
      <DrawbackRecoveryAgent />
    </div>
  );
}
