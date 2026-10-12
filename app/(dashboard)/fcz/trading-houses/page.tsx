import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { FczTradingHouseRegistry } from '@/components/fiz-fcz/fcz/FczTradingHouseRegistry';

export const metadata: Metadata = { title: 'Trading Houses' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Trading House Registry" description="Trading house registration and compliance" />
      <FczTradingHouseRegistry />
    </div>
  );
}