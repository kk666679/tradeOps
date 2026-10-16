'use client';

import type { IntegrationMode, RunStats } from '@/types';

export interface RunHUDProps {
  running: boolean;
  runStats: RunStats;
  mode: IntegrationMode;
  capCount: number;
}

export default function RunHUD({ running, runStats, mode, capCount }: RunHUDProps) {
  return (
    <div className="rounded-md border border-[#1f2937] bg-[#0b1424ee] px-2.5 py-[7px] font-mono text-[10px] leading-relaxed text-[#9ca3af]">
      {running ? (
        <>
          <div>running: <b className="text-[#60a5fa]">{runStats.node || '—'}</b></div>
          <div>
            loops: <b className="text-[#60a5fa]">{runStats.loops}</b>
            {' · '}iters: <b className="text-[#60a5fa]">{runStats.iterations}</b>
          </div>
        </>
      ) : (
        <>
          <div>mode: <b className="text-[#60a5fa]">{mode}</b></div>
          <div>caps: <b className="text-[#60a5fa]">{capCount}</b></div>
        </>
      )}
    </div>
  );
}