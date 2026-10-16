'use client';

import { ViewportPortal } from '@xyflow/react';
import type { ActiveGate } from '@/types';

export interface LoopPulseProps {
  activeGateIds: ActiveGate[];
}

export default function LoopPulse({ activeGateIds }: LoopPulseProps) {
  return (
    <ViewportPortal>
      {activeGateIds.map(({ x, y, id }) => (
        <div key={id}
          className="pointer-events-none absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_12px_#06b6d4]"
          style={{ left: x, top: y - 70 }} />
      ))}
    </ViewportPortal>
  );
}