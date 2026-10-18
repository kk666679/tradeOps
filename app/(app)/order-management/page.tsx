import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { OrderDashboard } from '@/components/order-management/core/OrderDashboard';
import { OrderKpiStrip } from '@/components/order-management/core/OrderKpiStrip';
import { OrderWorkbench } from '@/components/ai-composites/orders/order-workbench';
import { OrderAnalytics } from '@/components/order-management/analytics/OrderAnalytics';
import { OrderVolumeChart } from '@/components/order-management/analytics/OrderVolumeChart';
import { OrderLeadTimeChart } from '@/components/order-management/analytics/OrderLeadTimeChart';
import { OrderCostBreakdown } from '@/components/order-management/analytics/OrderCostBreakdown';
import { OrderExceptionPareto } from '@/components/order-management/analytics/OrderExceptionPareto';

export const metadata: Metadata = { title: 'Order Management' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Order Management" description="Purchase, manufacturing, trading, transhipment, fulfilment, and customs" />
      <OrderKpiStrip />
      <OrderDashboard />
      <OrderWorkbench />
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