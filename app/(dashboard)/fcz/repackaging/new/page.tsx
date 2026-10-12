import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FczRepackagingPanel } from '@/components/fiz-fcz/fcz/FczRepackagingPanel';

export const metadata: Metadata = { title: 'New Repackaging' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="New Repackaging Job" description="Create new repackaging job" />
      <FczRepackagingPanel />
    </div>
  );
}