'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Artifact, ArtifactHeader, ArtifactTitle, ArtifactDescription, ArtifactContent, ArtifactActions, ArtifactAction } from '@/components/ai-elements/artifact';
import { CodeBlock } from '@/components/ai-elements/code-block';
import { CopyIcon, CheckCircleIcon } from 'lucide-react';

export interface RulePack { id: string; name: string; version: string; effectiveFrom?: string; rules: { id: string; title: string; severity: 'block' | 'warn' | 'info'; expression: string }[] }
export interface RulePackViewerProps { className?: string; data?: unknown; pack?: RulePack; title?: string; onSelect?: (id: string) => void; }

const DEFAULT_PACK: RulePack = {
  id: 'bonded-v14', name: 'Bonded movement rules', version: 'v14.2', effectiveFrom: '2026-09-01',
  rules: [
    { id: 'R-101', title: 'Permit must be effective on arrival', severity: 'block', expression: 'permit.effectiveFrom <= arrival.at <= permit.effectiveTo' },
    { id: 'R-114', title: 'HS chapter requires CTO for transhipment', severity: 'block', expression: "movement.type == 'tranship' implies documents.cto.present" },
    { id: 'R-122', title: 'Dwell beyond free days escalates', severity: 'warn', expression: 'dwell.days > zone.freeDays implies notify(broker)' },
    { id: 'R-130', title: 'Duty estimate attached', severity: 'info', expression: 'declaration.dutyEstimate != null' },
  ],
};

/** Rule pack inspector — artifact shell + severity-grouped rules + expression preview. */
export function RulePackViewer({ className, data, pack, title = 'Rule pack', onSelect }: RulePackViewerProps) {
  const p = pack ?? (data as RulePack | undefined) ?? DEFAULT_PACK;
  const [active, setActive] = React.useState(p.rules[0]?.id);
  const rule = p.rules.find((r) => r.id === active) ?? p.rules[0];
  return (
    <Artifact className={className}>
      <ArtifactHeader>
        <div><ArtifactTitle>{title}: {p.name} · {p.version}</ArtifactTitle><ArtifactDescription>{`Effective ${p.effectiveFrom ?? '—'} · ${p.rules.length} rules`}</ArtifactDescription></div>
        <ArtifactActions><ArtifactAction tooltip="Copy pack id" icon={CopyIcon} onClick={() => void navigator.clipboard?.writeText(p.id)} /></ArtifactActions>
      </ArtifactHeader>
      <ArtifactContent className="grid gap-3 md:grid-cols-[220px_1fr]">
        <div className="space-y-1.5">
          {p.rules.map((r) => (
            <button key={r.id} onClick={() => { setActive(r.id); onSelect?.(r.id); }} className={`flex w-full items-center justify-between rounded-md border px-2 py-1.5 text-left text-xs ${r.id === active ? 'border-primary bg-primary/5' : 'hover:bg-muted'}`}>
              <span><span className="font-mono">{r.id}</span> · {r.title}</span>
              <Badge variant={r.severity === 'block' ? 'destructive' : r.severity === 'warn' ? 'secondary' : 'outline'}>{r.severity}</Badge>
            </button>
          ))}
        </div>
        {rule ? (
          <Card>
            <CardHeader><CardTitle className="text-sm">{rule.id} · {rule.title}</CardTitle><CardDescription>Severity: {rule.severity}</CardDescription></CardHeader>
            <CardContent className="space-y-2">
              <CodeBlock code={rule.expression} language="json" />
              <p className="flex items-center gap-1 text-[11px] text-muted-foreground"><CheckCircleIcon className="size-3" /> Evaluated on every declaration transition.</p>
            </CardContent>
          </Card>
        ) : null}
      </ArtifactContent>
    </Artifact>
  );
}

export default RulePackViewer;

