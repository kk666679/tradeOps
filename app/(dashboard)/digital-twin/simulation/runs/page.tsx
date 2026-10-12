import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { TwinRunControls } from '@/components/digital-twin/simulation/TwinRunControls';
import { TwinRunHistory } from '@/components/digital-twin/simulation/TwinRunHistory';
import { TwinRunInspector } from '@/components/digital-twin/simulation/TwinRunInspector';

export const metadata: Metadata = { title: 'Simulation Runs' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Simulation Runs" description="Execute and monitor simulation runs" />
      <TwinRunControls />
      <TwinRunHistory />
      <TwinRunInspector />
    </div>
  );
}