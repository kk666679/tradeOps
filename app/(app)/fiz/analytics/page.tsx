import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FizAnalyticsData } from '../_components/FizRouteViews';

export const metadata: Metadata = { title: 'FIZ Analytics' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="FIZ Analytics" description="Throughput, dwell time, utilization, trade balance, revenue, and tenant mix" />
      <FizAnalyticsData />
    </div>
  );
}