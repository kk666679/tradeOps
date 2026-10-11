'use client';

/**
 * aiAgentSelfHealer
 * Auto-scaffolded. Replace the body with domain logic.
 */

import * as React from 'react';

export interface aiAgentSelfHealerProps { prompt?: string; onAsk?: (q: string) => void; }

export function aiAgentSelfHealer({ prompt = '', onAsk }: aiAgentSelfHealerProps) {
  const [q, setQ] = React.useState(prompt);
  return (
    <div className="flex items-center gap-2 rounded border bg-background p-2">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">AI</span>
      <input
        className="flex-1 bg-transparent text-sm outline-none"
        placeholder="Ask the agent self healer…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') onAsk?.(q); }}
      />
    </div>
  );
}

export default aiAgentSelfHealer;
