import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { GateQueueMonitor } from '@/components/wms/gate/GateQueueMonitor';

export const metadata: Metadata = { title: 'Gate Queue' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Gate Queue" description="Live vehicle queue monitoring and lane assignment" />
      <GateQueueMonitor />
    </div>
  );
}