import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { OriginDeterminationAgent } from '@/components/custom-agents/customs-agents';

export const metadata: Metadata = { title: 'Origin' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Origin" description="Route: /custom-agents/customs-agents/origin" />
      <OriginDeterminationAgent />
    </div>
  );
}
