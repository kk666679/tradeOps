'use client';
import * as React from 'react';

interface Props { intervalMs?: number; healthy?: boolean; }

export function TwinHeartbeat({ intervalMs = 2_000, healthy = true }: Props) {
  const [beat, setBeat] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setBeat((b) => b + 1), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return (
    <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
      <span className={`h-2.5 w-2.5 rounded-full ${healthy ? 'bg-green-500 animate-ping' : 'bg-red-500'}`}
            style={{ animationDuration: `${intervalMs}ms` }} />
      <span className="tabular-nums">beat #{beat}</span>
      <span>{healthy ? 'Healthy' : 'Degraded'}</span>
    </div>
  );
}
export default TwinHeartbeat;
