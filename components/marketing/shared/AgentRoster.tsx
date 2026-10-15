import * as React from 'react';
import { TONES, type Tone } from './tone';

export interface AgentDef {
  name: string;
  kind: string;
  tone: Tone;
  skills: string[];
  guardrails: string[];
}

export const DEFAULT_AGENTS: AgentDef[] = [
  { name: 'Customs Agent',    kind: 'customs',   tone: 'signal', skills: ['classify-hs','estimate-value','determine-origin','screen-party','file-declaration'], guardrails: ['global','jurisdiction','spend'] },
  { name: 'Risk Agent',       kind: 'risk',      tone: 'alert',  skills: ['detect-anomaly','compliance-check','bottleneck-detect'], guardrails: ['global','tenant','jurisdiction'] },
  { name: 'Zone Agent',       kind: 'zone',      tone: 'fcz',    skills: ['issue-gate-pass','reconcile-bonded','claim-exemption'], guardrails: ['global','tenant','spend'] },
  { name: 'Operations Agent', kind: 'ops',       tone: 'fiz',    skills: ['track-cargo','flag-delays','daily-report'], guardrails: ['global','tenant'] },
  { name: 'Document Agent',   kind: 'document',  tone: 'fiz',    skills: ['extract','validate-fields','summarize'], guardrails: ['global','data-access'] },
  { name: 'Inventory Agent',  kind: 'inventory', tone: 'fiz',    skills: ['recommend-slot','detect-overcapacity','rebalance'], guardrails: ['global','tenant'] },
  { name: 'Forecast Agent',   kind: 'forecast',  tone: 'fiz',    skills: ['predict-volume','recommend-staffing'], guardrails: ['global','tenant'] },
];

export function AgentRoster({ agents = DEFAULT_AGENTS }: { agents?: AgentDef[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {agents.map((a) => {
        const t = TONES[a.tone];
        return (
          <div key={a.name} className={'rounded-lg border p-4 transition ' + t.ring + ' ' + t.surface + ' ' + t.hover}>
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">{a.name}</div>
              <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[10px]">{a.kind}</span>
            </div>
            <ul className="mt-2 space-y-0.5 font-mono text-xs text-muted-foreground">
              {a.skills.map((s) => <li key={s}>· {s}</li>)}
            </ul>
            <div className="mt-2 flex flex-wrap gap-1">
              {a.guardrails.map((g) => <span key={g} className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px]">{g}</span>)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
export default AgentRoster;
