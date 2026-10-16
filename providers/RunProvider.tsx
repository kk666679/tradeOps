'use client';

import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from 'react';
import type { RunEvent } from '@/hooks/useStreaming';

type Run = { events: RunEvent[] };
type RunAction = { type: 'event.append'; event: RunEvent };
type RunContextValue = { run: Run | null; dispatch: (action: RunAction) => void };

const RunContext = createContext<RunContextValue | null>(null);

export function RunProvider({ children }: { children: ReactNode }) {
  const [run, dispatch] = useReducer((current: Run | null, action: RunAction): Run => {
    if (action.type === 'event.append') {
      return { events: [...(current?.events ?? []), action.event] };
    }
    return current ?? { events: [] };
  }, null);
  const dispatchAction = useCallback((action: RunAction) => dispatch(action), []);
  const value = useMemo(() => ({ run, dispatch: dispatchAction }), [run, dispatchAction]);
  return <RunContext.Provider value={value}>{children}</RunContext.Provider>;
}

export function useRunContext() {
  const context = useContext(RunContext);
  if (!context) throw new Error('useRunContext must be used inside RunProvider');
  return context;
}
