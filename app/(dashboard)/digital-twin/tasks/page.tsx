import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { TwinTaskQueue } from '@/components/digital-twin/tasks/TwinTaskQueue';
import { TwinTaskBoard } from '@/components/digital-twin/tasks/TwinTaskBoard';
import { TwinTaskInspector } from '@/components/digital-twin/tasks/TwinTaskInspector';

export const metadata: Metadata = { title: 'Task Management' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Task Management" description="Task queue, Kanban board, and task inspection" />
      <div className="grid gap-6 lg:grid-cols-2">
        <TwinTaskQueue />
        <TwinTaskBoard />
      </div>
      <TwinTaskInspector />
    </div>
  );
}