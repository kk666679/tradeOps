import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FczRepackagingPanel } from '@/components/fiz-fcz/fcz/FczRepackagingPanel';

const handleSubmit = async (values: Record<string, unknown>) => {
  'use server';
  console.log('Submit:', values);
};

const handleCancel = async () => {
  'use server';
  console.log('Cancel');
};

export const metadata: Metadata = { title: 'New Repackaging' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="New Repackaging Job" description="Create new repackaging job" />
      <FczRepackagingPanel onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}