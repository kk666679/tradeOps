import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { TariffChangeWatcherAgent } from '@/components/custom-agents/customs-agents';

export const metadata: Metadata = { title: 'Tariff' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Tariff" description="Route: /custom-agents/customs-agents/tariff" />
      <TariffChangeWatcherAgent />
    </div>
  );
}
