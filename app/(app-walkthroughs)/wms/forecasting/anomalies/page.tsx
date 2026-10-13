import { WmsCrudSurface } from '@/app/(app-walkthroughs)/wms/_components/WmsCrudSurface';
import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { TwinLiveMetrics } from '@/components/workflow-studio/digital-twin/live/TwinLiveMetrics';

export const metadata: Metadata = { title: 'Anomaly Detection' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Anomaly Detection" description="AI-powered anomaly detection in warehouse operations" />
      <TwinLiveMetrics />
      <WmsCrudSurface resource="forecasting" title="forecasting anomalies records" />
    </div>
  );
}