'use client';
import * as React from 'react';

export interface StatsCounterProps { to: number; duration?: number; suffix?: string; prefix?: string; }
export function StatsCounter({ to, duration = 1200, suffix, prefix }: StatsCounterProps) {
  const [v, setV] = React.useState(0);
  React.useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return <span>{prefix}{v.toLocaleString()}{suffix}</span>;
}
export default StatsCounter;
