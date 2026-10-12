'use client';
import { createContext, useContext, type ReactNode } from 'react';

export interface SocketContextValue {
  connected: boolean;
  emit: (event: string, payload?: unknown) => void;
  on: (event: string, handler: (payload: unknown) => void) => () => void;
  subscribe: (channel: string, handler: (payload: unknown) => void) => () => void;
}

const NOOP_SOCKET: SocketContextValue = {
  connected: false,
  emit: () => {},
  on: () => () => {},
  subscribe: () => () => {},
};

const SocketContext = createContext<SocketContextValue>(NOOP_SOCKET);

export function SocketProvider({ children }: { children: ReactNode }) {
  return (
    <SocketContext.Provider value={NOOP_SOCKET}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket(): SocketContextValue {
  return useContext(SocketContext);
}
