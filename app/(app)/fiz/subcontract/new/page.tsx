import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FizSubcontractPanel } from '@/components/fiz-fcz/fiz/FizSubcontractPanel';

export const metadata: Metadata = { title: 'New Subcontract' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="New Subcontract" description="Create new subcontract work order" />
      <FizSubcontractPanel />
    </div>
  );
}