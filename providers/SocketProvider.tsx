'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { getAuthToken } from '@/lib/trpc';

interface SocketContextValue {
  socket: Socket | null;
  connected: boolean;
  subscribe: (event: string, handler: (data: any) => void) => () => void;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  connected: false,
  subscribe: () => () => {},
});

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }: { children: ReactNode }) {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3001', {
      path: '/api/realtime/socket.io',
      auth: { token },
      autoConnect: true,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  const subscribe = (event: string, handler: (data: any) => void) => {
    socketRef.current?.on(event, handler);
    return () => {
      socketRef.current?.off(event, handler);
    };
  };

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, connected, subscribe }}>
      {children}
    </SocketContext.Provider>
  );
}
