'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Task, TaskTrigger, TaskContent, TaskItem, TaskItemFile } from '@/components/ai-elements/task';
import { Queue, QueueList, QueueItem, QueueItemIndicator, QueueItemContent, QueueSection, QueueSectionTrigger, QueueSectionLabel, QueueSectionContent } from '@/components/ai-elements/queue';
import { Reasoning, ReasoningTrigger, ReasoningContent } from '@/components/ai-elements/reasoning';

export interface ScenarioStep { id: string; label: string; detail?: string; files?: string[] }
export interface ScenarioDef { id: string; name: string; zone?: 'FIZ' | 'FCZ' | 'BONDED'; steps: ScenarioStep[]; expectation?: string }
export interface ScenarioRunnerProps {
  className?: string;
  data?: unknown;
  scenarios?: ScenarioDef[];
  title?: string;
  onSelect?: (id: string) => void;
}

const DEFAULTS: ScenarioDef[] = [
  { id: 'fiz-release', name: 'FIZ direct release', zone: 'FIZ', expectation: 'Permit valid → release in < 4h', steps: [
    { id: 's1', label: 'Validate permit', detail: 'LMW / exemption still effective', files: ['permit.json'] },
    { id: 's2', label: 'Check HS + duty', detail: 'Tariff engine matches declaration', files: ['tariff.json'] },
    { id: 's3', label: 'Release gate', detail: 'No hold → green lane', files: ['gate.json'] },
  ]},
  { id: 'fcz-tranship', name: 'FCZ transhipment hold', zone: 'FCZ', expectation: 'Missing CTO → hold + notify broker', steps: [
    { id: 's1', label: 'Validate CTO', detail: 'Carrier transfer order present', files: ['cto.pdf'] },
    { id: 's2', label: 'Dwell check', detail: 'Free days remaining = 2', files: ['dwell.json'] },
    { id: 's3', label: 'Hold + escalate', detail: 'Notify broker, start clock', files: ['hold.json'] },
  ]},
];

/** What-if clearance scenarios — task breakdown + run queue. */
export function ScenarioRunner({ className, data, scenarios, title = 'Scenario runner', onSelect }: ScenarioRunnerProps) {
  const list = scenarios?.length ? scenarios : (Array.isArray((data as { scenarios?: ScenarioDef[] })?.scenarios) ? (data as { scenarios: ScenarioDef[] }).scenarios : DEFAULTS);
  const [active, setActive] = React.useState(list[0]?.id);
  const [running, setRunning] = React.useState(false);
  const current = list.find((s) => s.id === active) ?? list[0];
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div><CardTitle>{title}</CardTitle><CardDescription>Pick a what-if, inspect steps, queue a dry run</CardDescription></div>
        {current?.zone ? <Badge variant="outline">{current.zone}</Badge> : null}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {list.map((s) => (
            <button key={s.id} onClick={() => { setActive(s.id); onSelect?.(s.id); }} className={`rounded-full border px-3 py-1 text-xs ${s.id === active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
              {s.name}
            </button>
          ))}
        </div>
        {current ? (
          <Task defaultOpen>
            <TaskTrigger title={`${current.name} — ${current.steps.length} steps`} />
            <TaskContent>
              {current.steps.map((st) => (
                <TaskItem key={st.id}>{st.label} <span className="text-xs">— {st.detail}</span> {st.files?.map((f) => <TaskItemFile key={f}>{f}</TaskItemFile>)}
                </TaskItem>
              ))}
              {current.expectation ? <p className="text-xs text-muted-foreground">Expect: {current.expectation}</p> : null}
            </TaskContent>
          </Task>
        ) : null}
        <Queue>
          <QueueSection defaultOpen>
            <QueueSectionTrigger><QueueSectionLabel label="run queue" count={current?.steps.length ?? 0} /></QueueSectionTrigger>
            <QueueSectionContent>
              <QueueList>
                {(current?.steps ?? []).map((st, i) => (
                  <QueueItem key={st.id}><span className="flex items-center gap-2"><QueueItemIndicator completed={i === 0 && running} /><QueueItemContent completed={false}>{st.label}</QueueItemContent></span></QueueItem>
                ))}
              </QueueList>
            </QueueSectionContent>
          </QueueSection>
        </Queue>
        <Reasoning defaultOpen={false}>
          <ReasoningTrigger>Why this expectation?</ReasoningTrigger>
          <ReasoningContent>{`Rule pack + tariff version pinned to run. ${current?.expectation ?? ''}`}</ReasoningContent>
        </Reasoning>
        <button onClick={() => setRunning((v) => !v)} className="rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground">{running ? 'Stop dry run' : 'Queue dry run'}</button>
      </CardContent>
    </Card>
  );
}

export default ScenarioRunner;

