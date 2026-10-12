import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { TwinTaskBoard } from '@/components/digital-twin/tasks/TwinTaskBoard';

export const metadata: Metadata = { title: 'Task Board' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Task Board" description="Kanban-style task board and workflow" />
      <TwinTaskBoard />
    </div>
  );
}