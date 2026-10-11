'use client';

/**
 * aiValuationAdvisor
 * Auto-scaffolded. Replace the body with domain logic.
 */

import * as React from 'react';

export interface aiValuationAdvisorProps { prompt?: string; onAsk?: (q: string) => void; }

export function aiValuationAdvisor({ prompt = '', onAsk }: aiValuationAdvisorProps) {
  const [q, setQ] = React.useState(prompt);
  return (
    <div className="flex items-center gap-2 rounded border bg-background p-2">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">AI</span>
      <input
        className="flex-1 bg-transparent text-sm outline-none"
        placeholder="Ask the valuation advisor…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') onAsk?.(q); }}
      />
    </div>
  );
}

export default aiValuationAdvisor;
