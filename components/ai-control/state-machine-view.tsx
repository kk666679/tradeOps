'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plan, PlanHeader, PlanTitle, PlanDescription, PlanContent, PlanTrigger, PlanFooter } from '@/components/ai-elements/plan';
import { Tool, ToolHeader, ToolContent, ToolInput, ToolOutput } from '@/components/ai-elements/tool';
import { CodeBlock } from '@/components/ai-elements/code-block';

export interface StateNode { id: string; label: string; terminal?: boolean }
export interface StateMachineViewProps {
  className?: string;
  data?: unknown;
  states?: StateNode[];
  transitions?: { from: string; to: string; event: string }[];
  current?: string;
  title?: string;
  onSelect?: (id: string) => void;
}

const DEFAULT_STATES: StateNode[] = [
  { id: 'draft', label: 'Draft' },
  { id: 'submitted', label: 'Submitted' },
  { id: 'customs_hold', label: 'Customs hold' },
  { id: 'released', label: 'Released', terminal: true },
  { id: 'rejected', label: 'Rejected', terminal: true },
];
const DEFAULT_TX = [
  { from: 'draft', to: 'submitted', event: 'submit' },
  { from: 'submitted', to: 'customs_hold', event: 'hold' },
  { from: 'customs_hold', to: 'released', event: 'clear' },
  { from: 'submitted', to: 'rejected', event: 'reject' },
];

/** Declaration lifecycle — plan wrapper + transition inspector. */
export function StateMachineView({ className, data, states, transitions, current = 'submitted', title = 'Declaration state machine', onSelect }: StateMachineViewProps) {
  const list = states?.length ? states : DEFAULT_STATES;
  const tx = transitions?.length ? transitions : DEFAULT_TX;
  const [sel, setSel] = React.useState(current);
  const outgoing = tx.filter((t) => t.from === sel);
  const incoming = tx.filter((t) => t.to === sel);
  return (
    <Plan className={className} defaultOpen>
      <PlanHeader>
        <div><PlanTitle>{title}</PlanTitle><PlanDescription>{`Current: ${sel} · ${list.length} states · ${tx.length} transitions`}</PlanDescription></div>
        <PlanTrigger />
      </PlanHeader>
      <PlanContent>
        <CardContent className="space-y-3 p-0 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            {list.map((s, i) => (
              <React.Fragment key={s.id}>
                <button onClick={() => { setSel(s.id); onSelect?.(s.id); }} className={`rounded-full border px-3 py-1 text-xs ${s.id === sel ? 'bg-primary text-primary-foreground' : s.terminal ? 'border-dashed opacity-80 hover:bg-muted' : 'hover:bg-muted'}`}>
                  {s.label}
                </button>
                {i < list.length - 1 ? <span className="text-muted-foreground">→</span> : null}
              </React.Fragment>
            ))}
          </div>
          <Tool defaultOpen>
            <ToolHeader type="tool-state" state="output-available" title={`Transitions · ${sel}`} />
            <ToolContent>
              <ToolInput input={{ state: sel, incoming: incoming.length, outgoing: outgoing.length }} />
              <div className="text-xs">
                {outgoing.length ? outgoing.map((t) => <div key={t.event} className="flex justify-between border-b py-1 last:border-0"><span>on <code>{t.event}</code></span><span>→ {t.to}</span></div>) : <p className="text-muted-foreground">Terminal state — no outgoing events.</p>}
              </div>
              <ToolOutput output={`incoming: ${incoming.map((t) => `${t.from} via ${t.event}`).join(', ') || '—'}`} errorText={undefined as unknown as string} />
              <CodeBlock code={JSON.stringify(data ?? { state: sel, transitions: tx }, null, 2)} language="json" />
            </ToolContent>
          </Tool>
        </CardContent>
      </PlanContent>
      <PlanFooter><p className="text-[11px] text-muted-foreground">Events are validated against the bonded-movement rule pack.</p></PlanFooter>
    </Plan>
  );
}

export default StateMachineView;

