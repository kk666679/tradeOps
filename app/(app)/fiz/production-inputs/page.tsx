import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FizProductionInputTracker } from '@/components/fiz-fcz/fiz/FizProductionInputTracker';

export const metadata: Metadata = { title: 'Production Inputs' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Production Input Tracker" description="Monitor production input streams and scheduling" />
      <FizProductionInputTracker />
    </div>
  );
}