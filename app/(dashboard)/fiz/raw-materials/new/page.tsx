import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FizRawMaterialLedger } from '@/components/fiz-fcz/fiz/FizRawMaterialLedger';

export const metadata: Metadata = { title: 'New Raw Material Entry' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="New Raw Material Entry" description="Record new raw material intake" />
      <FizRawMaterialLedger />
    </div>
  );
}