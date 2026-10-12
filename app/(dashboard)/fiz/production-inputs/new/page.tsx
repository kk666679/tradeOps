import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FizProductionInputTracker } from '@/components/fiz-fcz/fiz/FizProductionInputTracker';

export const metadata: Metadata = { title: 'New Production Input' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="New Production Input" description="Schedule new production input stream" />
      <FizProductionInputTracker />
    </div>
  );
}