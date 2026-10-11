'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';

export interface TwinRunControlsProps { onRun?: (scenarioId: string) => void; scenarios?: { id: string; name: string }[]; }
export function TwinRunControls({ onRun, scenarios = [] }: TwinRunControlsProps) {
  const [sel, setSel] = React.useState(scenarios[0]?.id ?? '');
  return (
    <div className="flex items-center gap-2">
      <select value={sel} onChange={(e) => setSel(e.target.value)} className="rounded border bg-background px-2 py-1 text-sm">
        {scenarios.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>
      <Button size="sm" disabled={!sel} onClick={() => onRun?.(sel)}>Run scenario</Button>
    </div>
  );
}
export default TwinRunControls;
