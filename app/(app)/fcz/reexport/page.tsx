import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FczReexportPanel } from '@/components/fiz-fcz/fcz/FczReexportPanel';

const handleSubmit = async (values: Record<string, unknown>) => {
  'use server';
  console.log('Submit:', values);
};

const handleCancel = async () => {
  'use server';
  console.log('Cancel');
};

export const metadata: Metadata = { title: 'Re-export' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Re-export Operations" description="Re-export documentation and compliance" />
      <FczReexportPanel onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}