'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TwinRunControls } from '@/components/digital-twin/simulation/TwinRunControls';
import { TwinRunHistory } from '@/components/digital-twin/simulation/TwinRunHistory';
import { TwinRunInspector } from '@/components/digital-twin/simulation/TwinRunInspector';
import { TwinScenarioBuilder } from '@/components/digital-twin/simulation/TwinScenarioBuilder';
import { TwinScenarioLibrary } from '@/components/digital-twin/simulation/TwinScenarioLibrary';

export interface ScenarioRunnerProps {
  className?: string;
  zone?: 'FIZ' | 'FCZ' | 'BONDED';
  tenantId?: string;
  scenarios?: { id: string; name: string }[];
  onRun?: (scenarioId: string) => void;
}

export function ScenarioRunner({
  className,
  zone = 'FIZ',
  tenantId,
  scenarios = [],
  onRun,
}: ScenarioRunnerProps) {
  return (
    <section className={`space-y-6 ${className ?? ''}`} data-zone={zone} data-tenant={tenantId}>
      <div className="grid gap-6 lg:grid-cols-2">
        <TwinScenarioBuilder
          title="Scenario builder"
          hint="Configure a what-if scenario before starting a run."
          zone={zone === 'BONDED' ? undefined : zone}
        />
        <TwinScenarioLibrary
          title="Scenario library"
          hint={scenarios.length ? `${scenarios.length} scenarios available` : 'No saved scenarios available.'}
          value={scenarios.length || '—'}
          zone={zone === 'BONDED' ? undefined : zone}
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Run scenario</CardTitle>
        </CardHeader>
        <CardContent>
          <TwinRunControls scenarios={scenarios} onRun={onRun} />
        </CardContent>
      </Card>
      <div className="grid gap-6 lg:grid-cols-2">
        <TwinRunHistory title="Run history" hint="Completed and in-progress simulation runs appear here." />
        <TwinRunInspector title="Run details" hint="Select a run to inspect its results." />
      </div>
    </section>
  );
}

export default ScenarioRunner;
