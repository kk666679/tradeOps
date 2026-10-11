import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FczTradingHouseRegistry } from '@/components/fiz-fcz/fcz/FczTradingHouseRegistry';

export const metadata: Metadata = { title: 'New Trading House' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="New Trading House" description="Register new trading house" />
      <FczTradingHouseRegistry />
    </div>
  );
}