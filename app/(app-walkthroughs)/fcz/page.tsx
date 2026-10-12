import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FczHomeData } from './_components/FczRouteViews';

export const metadata: Metadata = { title: 'Free Commercial Zone (FCZ)' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Free Commercial Zone (FCZ)" description="Break bulk, transhipment, entrepôt trade, re-export, repackaging, trading houses, and value-added services" />
      <FczHomeData />
    </div>
  );
}