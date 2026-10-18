import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { SpendAuthorityCard } from '@/components/custom-agents/policy';

export const metadata: Metadata = { title: 'Spend' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Spend" description="Route: /custom-agents/policy/spend" />
      <SpendAuthorityCard />
    </div>
  );
}
