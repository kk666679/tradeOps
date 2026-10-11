'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Artifact, ArtifactHeader, ArtifactTitle, ArtifactDescription, ArtifactContent } from '@/components/ai-elements/artifact';
import { ChainOfThought, ChainOfThoughtHeader, ChainOfThoughtStep, ChainOfThoughtContent } from '@/components/ai-elements/chain-of-thought';
import { CodeBlock } from '@/components/ai-elements/code-block';

export interface EdiSegment { tag: string; label: string; fields: { name: string; value: string; valid?: boolean }[] }
export interface EdiViewerProps {
  className?: string;
  data?: unknown;
  messageId?: string;
  segments?: EdiSegment[];
  title?: string;
  onSelect?: (id: string) => void;
}

const DEFAULT_SEGMENTS: EdiSegment[] = [
  { tag: 'UNH', label: 'Message header', fields: [{ name: 'ref', value: 'DEC-8812', valid: true }, { name: 'type', value: 'CUSDEC', valid: true }] },
  { tag: 'BGM', label: 'Beginning of message', fields: [{ name: 'doc', value: '380 — commercial invoice', valid: true }] },
  { tag: 'NAD', label: 'Name + address', fields: [{ name: 'party', value: 'CN — consignee', valid: true }, { name: 'permit', value: 'LMW-2214 ✓', valid: true }] },
  { tag: 'LIN', label: 'Line items', fields: [{ name: 'lines', value: '14', valid: true }, { name: 'hs_errors', value: '1 — 8517.12 needs review', valid: false }] },
  { tag: 'UNT', label: 'Message trailer', fields: [{ name: 'count', value: '42 segments', valid: true }] },
];

/** EDI / ASYCUDA message viewer — segment tree + field validation. */
export function EdiViewer({ className, data, messageId = 'CUSDEC · DEC-8812', segments, title = 'EDI viewer', onSelect }: EdiViewerProps) {
  const rows = segments?.length ? segments : (Array.isArray((data as { segments?: EdiSegment[] })?.segments) ? (data as { segments: EdiSegment[] }).segments : DEFAULT_SEGMENTS);
  const [sel, setSel] = React.useState(rows[0]?.tag);
  const current = rows.find((r) => r.tag === sel) ?? rows[0];
  const invalid = rows.flatMap((r) => r.fields.filter((f) => f.valid === false));
  return (
    <Artifact className={className}>
      <ArtifactHeader>
        <div><ArtifactTitle>{title}</ArtifactTitle><ArtifactDescription>{`${messageId} · ${rows.length} segments · ${invalid.length} field warnings`}</ArtifactDescription></div>
        {invalid.length ? <Badge variant="destructive">{invalid.length} warnings</Badge> : <Badge variant="default">valid</Badge>}
      </ArtifactHeader>
      <ArtifactContent className="grid gap-3 md:grid-cols-[200px_1fr]">
        <ChainOfThought defaultOpen>
          <ChainOfThoughtHeader>Segments</ChainOfThoughtHeader>
          <ChainOfThoughtContent>
            {rows.map((s) => (
              <ChainOfThoughtStep key={s.tag} label={`${s.tag} — ${s.label}`} status={s.fields.some((f) => f.valid === false) ? 'active' : 'complete'} />
            ))}
          </ChainOfThoughtContent>
        </ChainOfThought>
        <Card>
          <CardHeader>
            <div className="flex flex-wrap gap-1.5">
              {rows.map((s) => (
                <button key={s.tag} onClick={() => { setSel(s.tag); onSelect?.(s.tag); }} className={`rounded border px-2 py-0.5 font-mono text-[11px] ${s.tag === sel ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>{s.tag}</button>
              ))}
            </div>
            <CardTitle className="text-sm">{current?.tag} · {current?.label}</CardTitle>
            <CardDescription>Click a segment tag to inspect fields</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {(current?.fields ?? []).map((f) => (
              <div key={f.name} className="flex items-center justify-between rounded border px-2 py-1.5 text-xs">
                <span className="font-mono text-muted-foreground">{f.name}</span>
                <span className="flex items-center gap-2"><span>{f.value}</span><Badge variant={f.valid === false ? 'destructive' : 'secondary'}>{f.valid === false ? 'review' : 'ok'}</Badge></span>
              </div>
            ))}
            <CodeBlock code={JSON.stringify(data ?? { messageId, segments: rows.length }, null, 2)} language="json" />
          </CardContent>
        </Card>
      </ArtifactContent>
    </Artifact>
  );
}

export default EdiViewer;

