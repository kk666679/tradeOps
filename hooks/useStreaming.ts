'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface RunEvent {
  id: string;
  at: string;
  agentId?: string;
  kind: string;
  payload: unknown;
}

export function useStreaming({ onEvent }: { onEvent: (event: RunEvent) => void }) {
  const [streaming, setStreaming] = useState(false);
  const source = useRef<EventSource | null>(null);

  const stop = useCallback(() => {
    source.current?.close();
    source.current = null;
    setStreaming(false);
  }, []);

  const start = useCallback((url: string) => {
    stop();
    const nextSource = new EventSource(url);
    source.current = nextSource;
    setStreaming(true);
    nextSource.onmessage = (message) => {
      try {
        onEvent(JSON.parse(message.data) as RunEvent);
      } catch {
        // Ignore malformed stream frames so one bad event does not end the stream.
      }
    };
    nextSource.onerror = () => {
      nextSource.close();
      if (source.current === nextSource) {
        source.current = null;
        setStreaming(false);
      }
    };
  }, [onEvent, stop]);

  useEffect(() => stop, [stop]);
  return { streaming, start, stop };
}
