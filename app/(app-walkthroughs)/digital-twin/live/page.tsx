import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { TwinLiveStream } from '@/components/digital-twin/live/TwinLiveStream';
import { TwinLiveMetrics } from '@/components/digital-twin/live/TwinLiveMetrics';
import { TwinLiveAlerts } from '@/components/digital-twin/live/TwinLiveAlerts';
import { TwinEventFeed } from '@/components/digital-twin/live/TwinEventFeed';
import { TwinHeartbeat } from '@/components/digital-twin/live/TwinHeartbeat';

export const metadata: Metadata = { title: 'Live Operations' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Live Operations" description="Real-time warehouse monitoring, metrics, alerts, and event feed" />
      <div className="grid gap-6 lg:grid-cols-3">
        <TwinLiveStream />
        <TwinLiveMetrics />
        <TwinHeartbeat />
      </div>
      <TwinLiveAlerts />
      <TwinEventFeed />
    </div>
  );
}