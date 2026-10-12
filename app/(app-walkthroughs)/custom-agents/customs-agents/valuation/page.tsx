import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { CustomsValuationAgent } from '@/components/custom-agents/customs-agents';

export const metadata: Metadata = { title: 'Valuation' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Valuation" description="Route: /custom-agents/customs-agents/valuation" />
      <CustomsValuationAgent />
    </div>
  );
}
