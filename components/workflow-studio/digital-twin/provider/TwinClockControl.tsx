'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useDigitalTwin } from './DigitalTwinProvider';

export function TwinClockControl() {
  const { clock } = useDigitalTwin();
  return (
    <div className="flex items-center gap-2 text-sm">
      <Button size="sm" variant={clock.running ? 'destructive' : 'default'} onClick={clock.running ? clock.pause : clock.start}>
        {clock.running ? 'Pause' : 'Run'}
      </Button>
      <span className="text-xs text-muted-foreground">tick {clock.tick} · speed x{clock.speed}</span>
      {[1, 2, 4, 10].map((s) => (
        <Button key={s} size="sm" variant={clock.speed === s ? 'default' : 'outline'} onClick={() => clock.setSpeed(s)}>x{s}</Button>
      ))}
    </div>
  );
}
export default TwinClockControl;
