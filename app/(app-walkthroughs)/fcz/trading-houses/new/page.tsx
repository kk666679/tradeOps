import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FczCreateForm } from '../../_components/FczRouteViews';

export const metadata: Metadata = { title: 'New Trading House' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="New Trading House" description="Register new trading house" />
      <FczCreateForm kind="tradingHouses" />
    </div>
  );
}