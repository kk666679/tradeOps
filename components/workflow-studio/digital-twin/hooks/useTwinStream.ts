'use client';

import { useEffect, useRef } from 'react';
import { useDigitalTwinStore } from '../store/useDigitalTwinStore';

/**
 * Drives the twin clock and emits synthetic events while `mode === 'running'`.
 * Replace the emit block with a real subscription (WebSocket / SSE / tRPC).
 */
export function useTwinStream() {
  const mode = useDigitalTwinStore((s) => s.mode);
  const speed = useDigitalTwinStore((s) => s.speed);
  const tickMs = useDigitalTwinStore((s) => s.tickMs);

  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number>(0);

  useEffect(() => {
    if (mode !== 'running') return;

    const step = (now: number) => {
      if (!lastRef.current) lastRef.current = now;
      const elapsed = now - lastRef.current;
      const interval = tickMs / speed;

      if (elapsed >= interval) {
        lastRef.current = now;

        const s = useDigitalTwinStore.getState();
        s.advanceClock(interval);

        if (s.nodes.length > 0) {
          const node = s.nodes[Math.floor(Math.random() * s.nodes.length)];
          const roll = Math.random();
          const severity: 'info' | 'warn' | 'error' =
            roll > 0.97 ? 'error' : roll > 0.9 ? 'warn' : 'info';

          s.pushEvent({
            kind: severity === 'info' ? 'metric' : 'alert',
            severity,
            message:
              severity === 'error'
                ? `Blocked at ${node.data.label}`
                : severity === 'warn'
                ? `Dwell exceeded at ${node.data.label}`
                : `Throughput tick at ${node.data.label}`,
            nodeId: node.id,
          });

          s.updateNodeData(node.id, {
            status: severity === 'error' ? 'blocked' : 'active',
            metrics: {
              ...(node.data.metrics ?? {}),
              lastTick: Date.now(),
            },
          });
        }
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastRef.current = 0;
    };
  }, [mode, speed, tickMs]);
}
