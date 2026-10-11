'use client';

/**
 * StreamingJson
 * AiElements 2026 · composed surface. Replace body with real logic.
 */

import * as React from 'react';

export interface StreamingJsonProps<T> {
  partial: string;        // partial JSON text being streamed
  onParse?: (v: T | null, err?: Error) => void;
  className?: string;
}

export function StreamingJson<T = unknown>({ partial, onParse, className }: StreamingJsonProps<T>) {
  const [value, setValue] = React.useState<T | null>(null);
  React.useEffect(() => {
    try { const v = JSON.parse(partial) as T; setValue(v); onParse?.(v); }
    catch (e) { onParse?.(null, e as Error); }
  }, [partial, onParse]);
  return <pre className={className ?? 'OverflowAuto rounded bg-muted/30 p-2 text-xs'}>{JSON.stringify(value, null, 2) ?? partial}</pre>;
}

export default StreamingJson;
