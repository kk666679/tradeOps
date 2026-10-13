'use client';

import { useCallback } from 'react';
import {
  useDigitalTwinStore,
  selectActiveRun,
} from '../store/useDigitalTwinStore';
import type { TwinRun } from '@/lib/digital-twin/types';

export function TwinRunControls() {
  const mode = useDigitalTwinStore((s) => s.mode);
  const setMode = useDigitalTwinStore((s) => s.setMode);
  const startRun = useDigitalTwinStore((s) => s.startRun);
  const endRun = useDigitalTwinStore((s) => s.endRun);
  const advanceClock = useDigitalTwinStore((s) => s.advanceClock);
  const activeRun = useDigitalTwinStore(selectActiveRun);

  const onRun = useCallback(() => {
    const id = `run_${Date.now().toString(36)}`;
    const run: TwinRun = {
      id,
      scenarioId: 'default',
      startedAt: Date.now(),
      status: 'running',
      stepIndex: 0,
      totalSteps: 240,
      metrics: { throughput: 0, dwell: 0, utilization: 0, cost: 0 },
    };
    startRun(run);
  }, [startRun]);

  const onPlayPause = useCallback(() => {
    if (mode === 'running') setMode('paused');
    else setMode('running');
  }, [mode, setMode]);

  const onStep = useCallback(() => {
    advanceClock(1000);
    setMode('stepped');
  }, [advanceClock, setMode]);

  const onStop = useCallback(() => {
    setMode('idle');
    if (activeRun) endRun(activeRun.id, 'completed');
  }, [setMode, activeRun, endRun]);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onRun}
        disabled={mode === 'running'}
        className="px-3 py-1.5 text-xs font-semibold rounded bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40"
      >
        ▶ Run
      </button>
      <button
        onClick={onPlayPause}
        disabled={mode === 'idle' && !activeRun}
        className="px-3 py-1.5 text-xs font-semibold rounded bg-slate-700 hover:bg-slate-600 text-slate-100 disabled:opacity-40"
      >
        {mode === 'running' ? '⏸ Pause' : '⏵ Resume'}
      </button>
      <button
        onClick={onStep}
        disabled={mode === 'running'}
        className="px-3 py-1.5 text-xs font-semibold rounded bg-slate-700 hover:bg-slate-600 text-slate-100 disabled:opacity-40"
      >
        ⏭ Step
      </button>
      <button
        onClick={onStop}
        className="px-3 py-1.5 text-xs font-semibold rounded bg-red-900/50 hover:bg-red-800/60 text-red-200"
      >
        ⏹ Stop
      </button>
    </div>
  );
}
