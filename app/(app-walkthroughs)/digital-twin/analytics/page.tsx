import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { TwinKpiStrip } from '@/components/workflow-studio/digital-twin/analytics/TwinKpiStrip';
import { TwinThroughputChart } from '@/components/workflow-studio/digital-twin/analytics/TwinThroughputChart';
import { TwinDwellChart } from '@/components/workflow-studio/digital-twin/analytics/TwinDwellChart';
import { TwinUtilizationHeatmap } from '@/components/workflow-studio/digital-twin/analytics/TwinUtilizationHeatmap';
import { TwinBottleneckPareto } from '@/components/workflow-studio/digital-twin/analytics/TwinBottleneckPareto';
import { TwinCostBreakdown } from '@/components/workflow-studio/digital-twin/analytics/TwinCostBreakdown';

export const metadata: Metadata = { title: 'Digital Twin Analytics' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Digital Twin Analytics" description="KPIs, throughput, dwell time, utilization, bottlenecks, and cost analysis" />
      <TwinKpiStrip />
      <div className="grid gap-6 lg:grid-cols-2">
        <TwinThroughputChart />
        <TwinDwellChart />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <TwinUtilizationHeatmap />
        <TwinBottleneckPareto />
      </div>
      <TwinCostBreakdown />
    </div>
  );
}