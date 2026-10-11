import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { ZoneThroughputChart } from '@/components/fiz-fcz/analytics/ZoneThroughputChart';
import { ZoneDwellTimeChart } from '@/components/fiz-fcz/analytics/ZoneDwellTimeChart';
import { ZoneUtilizationHeatmap } from '@/components/fiz-fcz/analytics/ZoneUtilizationHeatmap';
import { ZoneTradeBalanceChart } from '@/components/fiz-fcz/analytics/ZoneTradeBalanceChart';
import { ZoneRevenueCard } from '@/components/fiz-fcz/analytics/ZoneRevenueCard';
import { ZoneTenantMixChart } from '@/components/fiz-fcz/analytics/ZoneTenantMixChart';

export const metadata: Metadata = { title: 'FCZ Analytics' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="FCZ Analytics" description="Throughput, dwell time, utilization, trade balance, revenue, and tenant mix" />
      <ZoneRevenueCard />
      <div className="grid gap-6 lg:grid-cols-2">
        <ZoneThroughputChart />
        <ZoneDwellTimeChart />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <ZoneUtilizationHeatmap />
        <ZoneTradeBalanceChart />
      </div>
      <ZoneTenantMixChart />
    </div>
  );
}