import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FizMachineryImport } from '@/components/fiz-fcz/fiz/FizMachineryImport';

export const metadata: Metadata = { title: 'Machinery Import' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Machinery Import" description="Machinery import tracking and commissioning" />
      <FizMachineryImport />
    </div>
  );
}