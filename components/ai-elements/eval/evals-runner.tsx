'use client';

/**
 * EvalsRunner
 * AiElements 2026 · composed surface. Replace body with real logic.
 */

import * as React from 'react';
import { Button } from '@/components/ui/button';

export interface EvalsRunnerProps { suite: string; onRun?: () => void; running?: boolean; progress?: number; }

export function EvalsRunner({ suite, onRun, running, progress = 0 }: EvalsRunnerProps) {
  return (
    <div className="flex ItemsCenter gap-3 rounded border p-3 text-sm">
      <Button size="sm" disabled={running} onClick={onRun}>{running ? 'Running…' : 'Run'}</Button>
      <span className="FontMono text-xs">{suite}</span>
      {running ? <div className="MlAuto h-2 w-32 rounded bg-muted"><div className="h-2 rounded bg-primary" style={{ width: progress * 100 + '%' }} /></div> : null}
    </div>
  );
}

export default EvalsRunner;
