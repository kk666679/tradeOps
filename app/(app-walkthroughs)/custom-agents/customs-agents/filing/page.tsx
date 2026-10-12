import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { DeclarationFilingAgent } from '@/components/custom-agents/customs-agents';

export const metadata: Metadata = { title: 'Filing' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Filing" description="Route: /custom-agents/customs-agents/filing" />
      <DeclarationFilingAgent />
    </div>
  );
}
