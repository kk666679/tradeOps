import { WmsCrudSurface } from '@/app/(app-walkthroughs)/wms/_components/WmsCrudSurface';
import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { TwinLiveMetrics } from '@/components/digital-twin/live/TwinLiveMetrics';

export const metadata: Metadata = { title: 'Delay Prediction' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Delay Prediction" description="Predictive delay analytics for shipments and operations" />
      <TwinLiveMetrics />
      <WmsCrudSurface resource="forecasting" title="forecasting delays records" />
    </div>
  );
}