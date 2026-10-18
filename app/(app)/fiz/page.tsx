import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FizHomeData } from './_components/FizRouteViews';

export const metadata: Metadata = { title: 'Free Industrial Zone (FIZ)' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Free Industrial Zone (FIZ)" description="Raw materials, production inputs, finished goods, machinery, operators, subcontracting, wastage, and approvals" />
      <FizHomeData />
    </div>
  );
}