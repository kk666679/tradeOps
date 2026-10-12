import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { MetricsOverview } from '@/components/dashboard/MetricsOverview';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { Intelligence } from '@/components/ai-composites';

export const metadata: Metadata = { title: 'Dashboard' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Live warehouse and cargo overview" />
      <MetricsOverview />
      <RecentActivity />
      <Intelligence />
    </div>
  );
}
