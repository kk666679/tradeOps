import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FizUnavailable } from '../_components/FizRouteViews';

export const metadata: Metadata = { title: 'Finished Goods' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Finished Goods Register" description="Finished goods inventory and dispatch tracking" />
      <FizUnavailable entity="Finished goods" />
    </div>
  );
}