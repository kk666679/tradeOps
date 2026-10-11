'use client';

/**
 * AizonedBadge
 * Auto-scaffolded. Replace the body with domain logic.
 */

import * as React from 'react';

export interface AizonedBadgeProps { prompt?: string; onAsk?: (q: string) => void; }

export function AizonedBadge({ prompt = '', onAsk }: AizonedBadgeProps) {
  const [q, setQ] = React.useState(prompt);
  return (
    <div className="flex ItemsCenter gap-2 rounded border bg-background p-2">
      <span className="text-xs uppercase TrackingWide text-muted-foreground">AI</span>
      <input
        className="flex-1 bg-transparent text-sm OutlineNone"
        placeholder="Ask the ZonedBadge…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') onAsk?.(q); }}
      />
    </div>
  );
}

export default AizonedBadge;
