'use client';

/**
 * HsClassificationAgent
 * Autonomous customs agent surface: classifies free-text goods descriptions
 * against the WCO HS 2022 reference dataset and returns ranked candidate codes
 * with duty/tax treatment.
 */

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatHsCode, totalTaxRate } from '@/components/trade-ops/hs-classification/hs-code-data';
import type { HsCodeEntry } from '@/components/trade-ops/hs-classification/hs-code-data';

export type AgentStatus = 'idle' | 'running' | 'paused' | 'error';
export interface HsClassificationAgentProps {
  status?: AgentStatus;
  onRun?: () => void;
  onPause?: () => void;
  onClassify?: (result: HsClassificationAgentResult) => void;
}

export interface HsClassificationAgentResult {
  query: string;
  candidates: HsCodeEntry[];
  best: HsCodeEntry | null;
}

function rank(query: string, entry: HsCodeEntry): number {
  const q = query.trim().toLowerCase();
  if (!q) return 0;
  let score = 0;
  if (entry.code.startsWith(q.replace(/[\s.-]/g, ''))) score += 5;
  if (entry.description.toLowerCase().includes(q)) score += 3;
  for (const k of entry.keywords) {
    if (k === q) score += 4;
    else if (k.startsWith(q)) score += 2;
    else if (k.includes(q)) score += 1;
  }
  return score;
}

interface HsMatch { score: number; h: string }

export function HsClassificationAgent({
  status = 'idle',
  onRun,
  onPause,
  onClassify,
}: HsClassificationAgentProps) {
  const [query, setQuery] = React.useState('');
  const [candidates, setCandidates] = React.useState<HsCodeEntry[]>([]);

  const classify = React.useCallback(
    (text: string) => {
      // Import lazily to keep the module boundary explicit for consumers.
      const { HS_CODES } = require('@/components/trade-ops/hs-classification/hs-code-data');
      const scored = HS_CODES.map((h: HsCodeEntry) => ({ h, score: rank(text, h) }))
        .filter((s: { score: number; h: string }) => s.score > 0)
        .sort((a: { score: number }, b: { score: number }) => b.score - a.score)
        .slice(0, 5)
        .map((s: { h: string }) => s.h);
      setCandidates(scored);
      onClassify?.({ query: text, candidates: scored, best: scored[0] ?? null });
    },
    [onClassify],
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>HsClassification Agent</CardTitle>
        <Badge variant={status === 'error' ? 'destructive' : 'secondary'}>{status}</Badge>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p className="text-muted-foreground">
          Classify a goods description against the WCO HS 2022 tariff schedule.
        </p>
        <div className="flex gap-2">
          <Input
            placeholder="e.g. frozen atlantic salmon"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') classify(query); }}
          />
          <Button onClick={() => classify(query)} disabled={!query.trim() || status === 'running'}>
            Classify
          </Button>
        </div>

        {candidates.length > 0 ? (
          <ul className="divide-y rounded-md border">
            {candidates.map((c, i) => (
              <li key={c.code} className="flex items-center justify-between gap-2 p-2">
                <div className="min-w-0">
                  <div className="font-mono text-xs font-semibold">
                    {i === 0 ? <Badge className="mr-1">best</Badge> : null}
                    {formatHsCode(c.code)}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">{c.description}</div>
                </div>
                <div className="shrink-0 text-right text-xs">
                  <div className="font-mono">duty {(c.dutyRate * 100).toFixed(0)}%</div>
                  <div className="text-muted-foreground">total {(totalTaxRate(c) * 100).toFixed(0)}%</div>
                </div>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="flex gap-2">
          <button
            className="rounded bg-primary px-3 py-1 text-primary-foreground"
            onClick={onRun}
          >
            Run
          </button>
          <button className="rounded border px-3 py-1" onClick={onPause}>
            Pause
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

export default HsClassificationAgent;
