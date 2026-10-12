'use client';
import * as React from 'react';

export type TwinZone = 'FIZ' | 'FCZ' | 'BONDED';
export interface TwinClock { running: boolean; speed: number; tick: number; start: () => void; pause: () => void; setSpeed: (s: number) => void; }
interface Ctx {
  zone: TwinZone | 'ALL';
  setZone: (z: TwinZone | 'ALL') => void;
  clock: TwinClock;
}
const Ctx = React.createContext<Ctx | null>(null);
export function DigitalTwinProvider({ children, initialZone = 'ALL' }: { children: React.ReactNode; initialZone?: TwinZone | 'ALL' }) {
  const [zone, setZone] = React.useState<TwinZone | 'ALL'>(initialZone);
  const [running, setRunning] = React.useState(false);
  const [speed, setSpeed] = React.useState(1);
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setTick((t) => t + 1), Math.max(50, 1000 / speed));
    return () => clearInterval(id);
  }, [running, speed]);
  const clock = React.useMemo<TwinClock>(() => ({
    running, speed, tick,
    start: () => setRunning(true),
    pause: () => setRunning(false),
    setSpeed,
  }), [running, speed, tick]);
  return <Ctx.Provider value={{ zone, setZone, clock }}>{children}</Ctx.Provider>;
}
export function useDigitalTwin() {
  const v = React.useContext(Ctx);
  if (!v) throw new Error('useDigitalTwin must be used inside <DigitalTwinProvider>');
  return v;
}
export default DigitalTwinProvider;
