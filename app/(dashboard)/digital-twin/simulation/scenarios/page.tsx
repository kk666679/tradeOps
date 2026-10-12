import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { TwinScenarioBuilder } from '@/components/digital-twin/simulation/TwinScenarioBuilder';
import { TwinScenarioLibrary } from '@/components/digital-twin/simulation/TwinScenarioLibrary';

export const metadata: Metadata = { title: 'Scenario Library' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Scenario Library" description="Manage and configure simulation scenarios" />
      <TwinScenarioBuilder />
      <TwinScenarioLibrary />
    </div>
  );
}