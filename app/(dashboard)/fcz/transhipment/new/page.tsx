import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FczTranshipmentPanel } from '@/components/fiz-fcz/fcz/FczTranshipmentPanel';

export const metadata: Metadata = { title: 'New Transhipment' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="New Transhipment" description="Create new transhipment record" />
      <FczTranshipmentPanel />
    </div>
  );
}