import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FczBreakBulkPanel } from '@/components/fiz-fcz/fcz/FczBreakBulkPanel';

const handleSubmit = async (values: Record<string, unknown>) => {
  'use server';
  console.log('Submit:', values);
};

const handleCancel = async () => {
  'use server';
  console.log('Cancel');
};

export const metadata: Metadata = { title: 'New Break Bulk' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="New Break Bulk Operation" description="Create new break bulk operation" />
      <FczBreakBulkPanel onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}