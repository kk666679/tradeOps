import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
import { TwinScenarioBuilder } from '@/components/digital-twin/simulation/TwinScenarioBuilder';
import { TwinScenarioLibrary } from '@/components/digital-twin/simulation/TwinScenarioLibrary';
import { TwinRunControls } from '@/components/digital-twin/simulation/TwinRunControls';
import { TwinRunHistory } from '@/components/digital-twin/simulation/TwinRunHistory';
import { TwinWhatIfPanel } from '@/components/digital-twin/simulation/TwinWhatIfPanel';
import { TwinRunInspector } from '@/components/digital-twin/simulation/TwinRunInspector';
import { TwinSandbox } from '@/components/digital-twin/simulation/TwinSandbox';

export const metadata: Metadata = { title: 'Simulation Center' };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Simulation Center" description="Scenario builder, run controls, history, and what-if analysis" />
      <div className="grid gap-6 lg:grid-cols-2">
        <TwinScenarioBuilder />
        <TwinScenarioLibrary />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <TwinRunControls />
        <TwinWhatIfPanel />
      </div>
      <TwinRunHistory />
      <TwinRunInspector />
      <TwinSandbox />
    </div>
  );
}