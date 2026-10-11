import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { TwinLiveMetrics } from '@/components/digital-twin/live/TwinLiveMetrics';

export const metadata: Metadata = { title: 'Anomaly Detection' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Anomaly Detection" description="AI-powered anomaly detection in warehouse operations" />
      <TwinLiveMetrics />
    </div>
  );
}