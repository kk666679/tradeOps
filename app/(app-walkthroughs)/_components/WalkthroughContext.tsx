'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
interface WalkthroughState {
  visitedRoutes: string[];
  data: Record<string, unknown>;
}

interface WalkthroughContextValue extends WalkthroughState {
  markVisited: (href: string) => void;
  setData: (key: string, value: unknown) => void;
  runSeed: (workflowId: string, input?: Record<string, unknown>) => Promise<string | null>;
  seedRunning: boolean;
  seedError: string | null;
  reset: () => void;
}

const WalkthroughContext = React.createContext<WalkthroughContextValue | null>(null);

export function WalkthroughProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [state, setState] = React.useState<WalkthroughState>({ visitedRoutes: [], data: {} });
  const [seedRunning, setSeedRunning] = React.useState(false);
  const [seedError, setSeedError] = React.useState<string | null>(null);
  const markVisited = React.useCallback((href: string) => {
    setState((current) => current.visitedRoutes.includes(href)
      ? current
      : { ...current, visitedRoutes: [...current.visitedRoutes, href] });
  }, []);

  React.useEffect(() => {
    if (pathname) markVisited(pathname);
  }, [markVisited, pathname]);

  const runSeed = React.useCallback(async (workflowId: string, input: Record<string, unknown> = {}) => {
    setSeedRunning(true);
    setSeedError(null);
    try {
      const response = await fetch('/api/walkthrough/seed', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ workflowId, input }),
      });
      const result = await response.json() as { executionId?: string; status?: string; error?: string };
      if (!response.ok || !result.executionId) throw new Error(result.error ?? 'Workflow seed could not be started.');

      setState((current) => ({
        ...current,
        data: { ...current.data, lastSeedExecutionId: result.executionId, lastSeedStatus: result.status },
      }));

      let status = result.status;
      for (let attempt = 0; attempt < 12 && status === 'running'; attempt += 1) {
        await new Promise((resolve) => window.setTimeout(resolve, 500));
        const poll = await fetch(`/api/walkthrough/runs/${result.executionId}`, { cache: 'no-store' });
        if (!poll.ok) throw new Error('Unable to read workflow seed status.');
        const current = await poll.json() as { status?: string; stepIndex?: number; totalSteps?: number };
        status = current.status;
        setState((state) => ({ ...state, data: { ...state.data, lastSeedStatus: status, lastSeedProgress: { stepIndex: current.stepIndex, totalSteps: current.totalSteps } } }));
      }
      return result.executionId;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Workflow seed could not be started.';
      setSeedError(message);
      return null;
    } finally {
      setSeedRunning(false);
    }
  }, []);

  const value = React.useMemo(() => ({
    ...state,
    markVisited,
    setData: (key: string, nextValue: unknown) => {
      setState((current) => ({ ...current, data: { ...current.data, [key]: nextValue } }));
    },
    runSeed,
    seedRunning,
    seedError,
    reset: () => {
      setSeedError(null);
      setState({ visitedRoutes: [], data: {} });
    },
  }), [markVisited, runSeed, seedError, seedRunning, state]);

  return <WalkthroughContext.Provider value={value}>{children}</WalkthroughContext.Provider>;
}

export function useWalkthrough() {
  const value = React.useContext(WalkthroughContext);
  if (!value) throw new Error('useWalkthrough must be used inside WalkthroughProvider');
  return value;
}

export function WalkthroughRouteTracker() {
  useWalkthrough();
  return null;
}
