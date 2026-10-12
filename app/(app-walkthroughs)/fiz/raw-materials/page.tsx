import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FizUnavailable } from '../_components/FizRouteViews';

export const metadata: Metadata = { title: 'Raw Materials' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Raw Materials Ledger" description="Track raw material intake, consumption, and inventory" />
      <FizUnavailable entity="Raw material" />
    </div>
  );
}