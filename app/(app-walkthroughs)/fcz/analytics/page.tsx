import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FczAnalyticsData } from '../_components/FczRouteViews';

export const metadata: Metadata = { title: 'FCZ Analytics' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="FCZ Analytics" description="Throughput, dwell time, utilization, trade balance, revenue, and tenant mix" />
      <FczAnalyticsData />
    </div>
  );
}