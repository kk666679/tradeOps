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

export const metadata: Metadata = { title: 'Break Bulk Operations' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Break Bulk Operations" description="Break bulk cargo handling and deconsolidation" />
      <FczBreakBulkPanel onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}