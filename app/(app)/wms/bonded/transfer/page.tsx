import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { BondedTransferForm } from '@/components/wms/bonded/BondedTransferForm';

const handleSubmit = async (values: Record<string, unknown>) => {
  'use server';
  console.log('Submit:', values);
};

const handleCancel = async () => {
  'use server';
  console.log('Cancel');
};

export const metadata: Metadata = { title: 'Bonded Transfer' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Bonded Transfer" description="Inter-bonded warehouse transfers" />
      <BondedTransferForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}