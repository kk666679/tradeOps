import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { OrderAnalytics } from '@/components/order-management/analytics/OrderAnalytics';
import { OrderVolumeChart } from '@/components/order-management/analytics/OrderVolumeChart';
import { OrderLeadTimeChart } from '@/components/order-management/analytics/OrderLeadTimeChart';
import { OrderCostBreakdown } from '@/components/order-management/analytics/OrderCostBreakdown';
import { OrderExceptionPareto } from '@/components/order-management/analytics/OrderExceptionPareto';

export const metadata: Metadata = { title: 'Order Analytics' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Order Analytics" description="Volume, lead time, cost breakdown, and exception analysis" />
      <OrderAnalytics />
      <div className="grid gap-6 lg:grid-cols-2">
        <OrderVolumeChart />
        <OrderLeadTimeChart />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <OrderCostBreakdown />
        <OrderExceptionPareto />
      </div>
    </div>
  );
}