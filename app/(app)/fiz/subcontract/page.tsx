import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FizSubcontractPanel } from '@/components/fiz-fcz/fiz/FizSubcontractPanel';

export const metadata: Metadata = { title: 'Subcontracting' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Subcontracting" description="Subcontractor management and work orders" />
      <FizSubcontractPanel />
    </div>
  );
}