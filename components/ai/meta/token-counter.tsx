'use client';

/**
 * TokenCounter
 * AiElements 2026 · composed surface. Replace body with real logic.
 */

import * as React from 'react';

export interface TokenCounterProps { input: number; output: number; cached?: number; compact?: boolean; }

export function TokenCounter({ input, output, cached = 0 }: TokenCounterProps) {
  return <span className="text-xs text-muted-foreground">↑{input.toLocaleString()} ↓{output.toLocaleString()}{cached ? ' · cache ' + cached.toLocaleString() : ''}</span>;
}

export default TokenCounter;
