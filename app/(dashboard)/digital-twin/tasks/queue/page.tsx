import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { TwinTaskQueue } from '@/components/digital-twin/tasks/TwinTaskQueue';

export const metadata: Metadata = { title: 'Task Queue' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Task Queue" description="Prioritized task queue and scheduling" />
      <TwinTaskQueue />
    </div>
  );
}