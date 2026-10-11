import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { TwinWhatIfPanel } from '@/components/digital-twin/simulation/TwinWhatIfPanel';

export const metadata: Metadata = { title: 'What-If Analysis' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="What-If Analysis" description="Interactive what-if scenario exploration" />
      <TwinWhatIfPanel />
    </div>
  );
}