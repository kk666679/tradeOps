import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { BondedLedgerAgent } from '@/components/custom-agents/customs-agents';

export const metadata: Metadata = { title: 'Bonded' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Bonded" description="Route: /custom-agents/customs-agents/bonded" />
      <BondedLedgerAgent />
    </div>
  );
}
