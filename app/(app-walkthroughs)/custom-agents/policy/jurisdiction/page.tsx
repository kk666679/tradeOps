import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { JurisdictionSelector } from '@/components/custom-agents/policy';

export const metadata: Metadata = { title: 'Jurisdiction' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Jurisdiction" description="Route: /custom-agents/policy/jurisdiction" />
      <JurisdictionSelector />
    </div>
  );
}
