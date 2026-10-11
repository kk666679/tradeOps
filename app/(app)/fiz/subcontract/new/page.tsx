import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FizSubcontractPanel } from '@/components/fiz-fcz/fiz/FizSubcontractPanel';

const handleSubmit = async (values: Record<string, unknown>) => {
  'use server';
  console.log('Submit:', values);
};

const handleCancel = async () => {
  'use server';
  console.log('Cancel');
};

export const metadata: Metadata = { title: 'New Subcontract' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="New Subcontract" description="Create new subcontract work order" />
      <FizSubcontractPanel onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}