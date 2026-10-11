'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Message, MessageContent, MessageResponse } from '@/components/ai-elements/message';
import { Sources, SourcesTrigger, SourcesContent, Source } from '@/components/ai-elements/sources';
import { Suggestion, Suggestions } from '@/components/ai-elements/suggestion';
import { CodeBlock } from '@/components/ai-elements/code-block';

export interface TariffChange { hs: string; from: string; to: string; impact: 'up' | 'down' | 'flat'; note?: string }
export interface TariffDiffProps {
  className?: string;
  data?: unknown;
  fromVersion?: string;
  toVersion?: string;
  changes?: TariffChange[];
  title?: string;
  onSelect?: (id: string) => void;
}

const DEFAULT_CHANGES: TariffChange[] = [
  { hs: '8471.30', from: '0%', to: '5%', impact: 'up', note: 'ADP machines — exemption still applies under LMW' },
  { hs: '8517.12', from: '10%', to: '8%', impact: 'down', note: 'Smartphones — SST treatment unchanged' },
  { hs: '8708.99', from: '15%', to: '15%', impact: 'flat', note: 'Auto parts — no change' },
];

/** Tariff version diff — impact summary + HS-level changes + sources. */
export function TariffDiff({ className, data, fromVersion = 'v2026.08', toVersion = 'v2026.10', changes, title = 'Tariff diff', onSelect }: TariffDiffProps) {
  const rows = changes?.length ? changes : (Array.isArray((data as { changes?: TariffChange[] })?.changes) ? (data as { changes: TariffChange[] }).changes : DEFAULT_CHANGES);
  const ups = rows.filter((r) => r.impact === 'up').length;
  const downs = rows.filter((r) => r.impact === 'down').length;
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{`${fromVersion} → ${toVersion} · ${rows.length} HS lines · ${ups} up · ${downs} down`}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Message from="assistant">
          <MessageContent>
            <MessageResponse>{`Duty impact: **${ups} increases**, **${downs} decreases**. Review FIZ exemption coverage before ${toVersion} takes effect.`}</MessageResponse>
          </MessageContent>
        </Message>
        <div className="overflow-hidden rounded-md border">
          <table className="w-full text-xs">
            <thead className="bg-muted/40 uppercase"><tr><th className="p-2 text-left">HS</th><th className="p-2">From</th><th className="p-2">To</th><th className="p-2">Impact</th><th className="p-2 text-left">Note</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.hs} onClick={() => onSelect?.(r.hs)} className="cursor-pointer border-b last:border-0 hover:bg-accent">
                  <td className="p-2 font-mono">{r.hs}</td><td className="p-2 text-center">{r.from}</td><td className="p-2 text-center font-medium">{r.to}</td>
                  <td className="p-2 text-center"><Badge variant={r.impact === 'up' ? 'destructive' : r.impact === 'down' ? 'default' : 'outline'}>{r.impact}</Badge></td>
                  <td className="p-2 text-muted-foreground">{r.note ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Sources>
          <SourcesTrigger count={2} />
          <SourcesContent>
            <Source href="#" title={`Tariff book ${toVersion}`} />
            <Source href="#" title="JKDM exemption circular" />
          </SourcesContent>
        </Sources>
        <Suggestions>
          <Suggestion suggestion="Recompute open declarations" />
          <Suggestion suggestion="Notify affected brokers" />
        </Suggestions>
        <CodeBlock code={JSON.stringify(data ?? { fromVersion, toVersion, lines: rows.length }, null, 2)} language="json" />
      </CardContent>
    </Card>
  );
}

export default TariffDiff;

