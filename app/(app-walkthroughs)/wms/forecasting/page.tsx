import { WmsCrudSurface } from '@/app/(app)/wms/_components/WmsCrudSurface';
import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { TwinLiveMetrics } from '@/components/digital-twin/live/TwinLiveMetrics';

export const metadata: Metadata = { title: 'Forecasting & Analytics' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Forecasting & Analytics" description="Demand forecasting, anomaly detection, and delay prediction" />
      <TwinLiveMetrics />
      <WmsCrudSurface resource="forecasting" title="forecasting records" />
    </div>
  );
}