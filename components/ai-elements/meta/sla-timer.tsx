'use client';

/**
 * SlaTimer
 * AiElements 2026 · composed surface. Replace body with real logic.
 */

import * as React from 'react';

export interface SlaTimerProps { deadline: string; }

export function SlaTimer({ deadline }: SlaTimerProps) {
  const [now, setNow] = React.useState(Date.now());
  React.useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);
  const ms = new Date(deadline).getTime() - now;
  const breached = ms < 0;
  const h = Math.floor(Math.abs(ms) / 3600000); const m = Math.floor((Math.abs(ms) % 3600000) / 60000); const s = Math.floor((Math.abs(ms) % 60000) / 1000);
  return <span className={breached ? 'text-red-600' : 'text-muted-foreground'}>{breached ? '-' : ''}{h}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}</span>;
}

export default SlaTimer;
