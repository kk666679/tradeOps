import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import {
  GateQueueMonitor,
  GateAnprFeed,
  GatePassScanner,
  GateWeighbridgePanel,
  GateExceptionQueue,
} from '@/components/wms/gate';

export const metadata: Metadata = { title: 'Gate Operations' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Gate Operations" description="Vehicle queue, ANPR, pass scanning, weighbridge, and exceptions" />
      <div className="grid gap-6 lg:grid-cols-2">
        <GateQueueMonitor />
        <GateAnprFeed />
        <GatePassScanner />
        <GateWeighbridgePanel />
      </div>
      <GateExceptionQueue />
    </div>
  );
}