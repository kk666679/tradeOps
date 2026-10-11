'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface SimulatorProps {
  digitalTwinId: string;
}

export function Simulator({ digitalTwinId }: SimulatorProps) {
  const [scenario, setScenario] = useState('DEMAND_SPIKE');
  const [results, setResults] = useState<{
    scenario: string;
    digitalTwinId: string;
    status: string;
    message: string;
  } | null>(null);

  const previewScenario = () => {
    if (!scenario) return;
    setResults({
      scenario,
      digitalTwinId,
      status: 'preview',
      message: 'The configured API does not currently provide scenario execution.',
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3>What-If Scenario Preview</h3>
        <select value={scenario} onChange={(e) => setScenario(e.target.value)} className="mb-4 rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white">
          <option value="DEMAND_SPIKE">Demand Spike</option>
          <option value="SUPPLIER_FAILURE">Supplier Failure</option>
          <option value="TRANSPORT_DELAY">Transport Delay</option>
          <option value="BASELINE">Baseline</option>
        </select>
        <Button onClick={previewScenario}>
          Preview Scenario
        </Button>
        {results && (
          <pre className="mt-4 rounded border border-slate-700 bg-slate-950 p-3 text-xs text-slate-200">
            {JSON.stringify(results, null, 2)}
          </pre>
        )}
      </CardContent>
    </Card>
  );
}
