import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { TwinCanvas } from '@/components/ai-composites/digital-twin/twin-canvas';
import { ZoneMap } from '@/components/ai-composites/digital-twin/zone-map';
import { TwinKpiStrip } from '@/components/digital-twin/analytics/TwinKpiStrip';
import { TwinThroughputChart } from '@/components/digital-twin/analytics/TwinThroughputChart';
import { TwinDwellChart } from '@/components/digital-twin/analytics/TwinDwellChart';
import { TwinUtilizationHeatmap } from '@/components/digital-twin/analytics/TwinUtilizationHeatmap';
import { TwinBottleneckPareto } from '@/components/digital-twin/analytics/TwinBottleneckPareto';
import { TwinCostBreakdown } from '@/components/digital-twin/analytics/TwinCostBreakdown';

export const metadata: Metadata = { title: 'Digital Twin' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Digital Twin" description="Real-time warehouse simulation, zone visualization, and operational analytics" />
      <TwinKpiStrip />
      <div className="grid gap-6 lg:grid-cols-2">
        <TwinCanvas />
        <ZoneMap />
      </div>
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