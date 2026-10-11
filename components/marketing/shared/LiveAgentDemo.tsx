'use client';
import * as React from 'react';
import { zoneChip } from './tone';

interface StepDef {
  agent: string; skill: string; tool?: string; reasoning: string;
  confidence: number; tokensIn: number; tokensOut: number; costUsd: number; duration: number;
}

const SCRIPT: StepDef[] = [
  { agent: 'document', skill: 'extract',           tool: 'ocr.doc',         reasoning: 'Parsed BoL + invoice. 11 fields extracted.',              confidence: 0.97, tokensIn: 820, tokensOut: 210, costUsd: 0.0041, duration: 1400 },
  { agent: 'customs',  skill: 'classify-hs',       tool: 'rules.hs-2022',   reasoning: 'Matched chapter 84 to 8471.30.10. 2 alternates scored.',  confidence: 0.94, tokensIn: 640, tokensOut: 180, costUsd: 0.0038, duration: 1100 },
  { agent: 'customs',  skill: 'estimate-value',    tool: 'rules.valuation', reasoning: 'Transaction value applicable. Invoice = MYR 118,400 CIF.', confidence: 0.96, tokensIn: 510, tokensOut: 140, costUsd: 0.0029, duration: 900 },
  { agent: 'customs',  skill: 'determine-origin',  tool: 'rules.rcep',      reasoning: 'Local content 45% meets RCEP 40%. Origin MY.',             confidence: 0.93, tokensIn: 470, tokensOut: 160, costUsd: 0.0026, duration: 900 },
  { agent: 'risk',     skill: 'screen-party',      tool: 'rules.sanctions', reasoning: 'Consignee + notify screened. No hits. Dual-use: no.',    confidence: 0.99, tokensIn: 380, tokensOut: 90,  costUsd: 0.0019, duration: 800 },
  { agent: 'customs',  skill: 'file-declaration',  tool: 'gateway.customs', reasoning: 'Draft declaration K2 prepared. 12 lines, 3 docs linked.', confidence: 0.95, tokensIn: 900, tokensOut: 320, costUsd: 0.0053, duration: 1200 },
];

type Phase = 'idle' | 'running' | 'awaiting_approval' | 'done';
interface Step { agent: string; skill: string; tool?: string; reasoning: string; confidence: number }
interface AuditEntry { actor: 'agent' | 'human' | 'system'; action: string; target: string; prevHash: string; hash: string; at: string }

/* Pre-computed totals so the idle state shows a realistic completed run
   instead of zeros — visitors can see what the final output looks like. */
const TOTALS = SCRIPT.reduce((a, s) => ({
  usd: a.usd + s.costUsd,
  tokensIn: a.tokensIn + s.tokensIn,
  tokensOut: a.tokensOut + s.tokensOut,
  latencyMs: a.latencyMs + s.duration,
}), { usd: 0, tokensIn: 0, tokensOut: 0, latencyMs: 0 });

const SAMPLE_AUDIT: AuditEntry[] = [
  { actor: 'system', action: 'session.opened', target: 'K2/FIZ/2026/00418', prevHash: 'genesis', hash: 'h_a1b2c3d4', at: '2026-10-09T10:00:00Z' },
  { actor: 'agent',  action: 'document.extract', target: 'K2/FIZ/2026/00418', prevHash: 'h_a1b2c3d4', hash: 'h_e5f6g7h8', at: '2026-10-09T10:00:01Z' },
  { actor: 'agent',  action: 'customs.classify-hs', target: 'K2/FIZ/2026/00418', prevHash: 'h_e5f6g7h8', hash: 'h_i9j0k1l2', at: '2026-10-09T10:00:02Z' },
  { actor: 'human',  action: 'hitl.approved', target: 'K2/FIZ/2026/00418', prevHash: 'h_i9j0k1l2', hash: 'h_m3n4o5p6', at: '2026-10-09T10:00:03Z' },
  { actor: 'system', action: 'audit.chain.sealed', target: 'K2/FIZ/2026/00418', prevHash: 'h_m3n4o5p6', hash: 'h_q7r8s9t0', at: '2026-10-09T10:00:04Z' },
];

export interface LiveAgentDemoProps {
  zone?: 'FIZ' | 'FCZ';
  amountUsd?: number;
  className?: string;
}

export function LiveAgentDemo({ zone = 'FIZ', amountUsd = 118400, className }: LiveAgentDemoProps) {
  const [phase, setPhase] = React.useState<Phase>('idle');
  const [steps, setSteps] = React.useState<Step[]>([]);
  const [audit, setAudit] = React.useState<AuditEntry[]>([]);
  const [cost, setCost] = React.useState({ usd: 0, tokensIn: 0, tokensOut: 0, latencyMs: 0 });
  const [decision, setDecision] = React.useState<'approve' | 'reject' | null>(null);
  const timers = React.useRef<number[]>([]);

  const clear = () => { timers.current.forEach((t) => clearTimeout(t)); timers.current = []; };

  const pushAudit = (actor: AuditEntry['actor'], action: string) => {
    setAudit((prev) => {
      const prevHash = prev.length ? prev[prev.length - 1].hash : 'genesis';
      const hash = 'h_' + Math.random().toString(36).slice(2, 10);
      const target = 'K2/' + zone + '/2026/00418';
      return [...prev, { actor, action, target, prevHash, hash, at: new Date().toISOString() }];
    });
  };

  const run = () => {
    clear();
    setPhase('running'); setSteps([]); setAudit([]); setDecision(null);
    setCost({ usd: 0, tokensIn: 0, tokensOut: 0, latencyMs: 0 });
    let acc = 0;
    SCRIPT.forEach((s) => {
      acc += s.duration;
      timers.current.push(window.setTimeout(() => {
        setSteps((prev) => [...prev, s]);
        setCost((c) => ({
          usd: c.usd + s.costUsd,
          tokensIn: c.tokensIn + s.tokensIn,
          tokensOut: c.tokensOut + s.tokensOut,
          latencyMs: c.latencyMs + s.duration,
        }));
        pushAudit('agent', s.agent + '.' + s.skill);
      }, acc));
    });
    timers.current.push(window.setTimeout(() => {
      setPhase('awaiting_approval');
      pushAudit('system', 'hitl.gate.opened');
    }, acc + 200));
  };

  const approve = () => {
    setDecision('approve'); setPhase('done');
    pushAudit('human', 'hitl.approved');
    pushAudit('agent', 'risk.review');
    pushAudit('system', 'audit.chain.sealed');
  };
  const reject = () => {
    setDecision('reject'); setPhase('done');
    pushAudit('human', 'hitl.rejected');
  };

  React.useEffect(() => () => clear(), []);

  const conf = steps.length ? steps[steps.length - 1].confidence : 0;
  const pct = conf * 100;

  return (
    <div className={'grid gap-4 lg:grid-cols-[1fr_360px] ' + (className ?? '')}>
      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-lg border bg-card p-3 text-xs">
          <div className="flex items-center gap-2">
            <span className={zoneChip(zone)}>{zone}</span>
            <span className="font-mono">{'K2/' + zone + '/2026/00418'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Status</span>
            <span className={'rounded-full border px-2 py-0.5 text-xs ' + (phase === 'idle' ? 'border-signal-300 text-signal-600' : phase === 'running' ? 'border-cargo-300 text-cargo-600' : phase === 'awaiting_approval' ? 'border-cargo-300 text-cargo-600' : 'border-clear-300 text-clear-600')}>
              {phase === 'idle' ? 'Ready' : phase === 'running' ? 'Running' : phase === 'awaiting_approval' ? 'Awaiting approval' : 'Done'}
            </span>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="flex items-center justify-between border-b px-3 py-2 text-xs">
            <span className="font-medium">Agent steps</span>
            <span className="text-muted-foreground">{steps.length + ' / ' + SCRIPT.length}</span>
          </div>
          <ol className="divide-y">
            {steps.length === 0 ? (
              <li className="p-4 text-center text-xs text-muted-foreground">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-border">
                  <span className="h-2 w-2 rounded-full bg-signal-500" />
                </div>
                6 steps · ~6.3s total · press Run the agent to stream the loop.
              </li>
            ) : steps.map((s, i) => (
              <li key={i} className="flex items-start gap-3 p-3 text-sm">
                <span className={'mt-1 h-2 w-2 rounded-full ' + (i === steps.length - 1 && phase === 'running' ? 'animate-pulse bg-signal-500' : 'bg-clear-500')} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border px-2 py-0.5 font-mono text-xs">{s.agent}</span>
                    <span className="font-mono text-xs">{s.skill}</span>
                    {s.tool ? <span className="text-xs text-muted-foreground">{'· ' + s.tool}</span> : null}
                    <span className="ml-auto text-xs text-muted-foreground">{(s.confidence * 100).toFixed(0) + '%'}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{s.reasoning}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {phase === 'awaiting_approval' ? (
          <div className="rounded border border-cargo-300 bg-cargo-500/10 p-3 text-sm text-cargo-600">
            <div className="flex items-center justify-between">
              <span className="font-medium">Human approval required</span>
              <span className="rounded-full border border-cargo-400 px-2 py-0.5 text-[10px]">amount &gt; MYR 100k</span>
            </div>
            <p className="mt-1 text-xs">Rule pack <code className="rounded bg-card px-1">my-customs-act-1967</code> · spend tier OPS_MANAGER.</p>
            <div className="mt-2 flex gap-2">
              <button onClick={approve} className="rounded bg-foreground px-3 py-1 text-xs font-medium text-background">Approve and file</button>
              <button onClick={reject} className="rounded border border-border px-3 py-1 text-xs">Reject</button>
            </div>
            <p className="mt-2 text-[11px] text-cargo-600/80">{'MYR ' + amountUsd.toLocaleString() + ' · sample declaration'}</p>
          </div>
        ) : null}

        {phase === 'done' && decision === 'approve' ? (
          <div className="rounded border border-clear-300 bg-clear-500/10 p-3 text-sm text-clear-600">Declaration filed as draft. Audit chain sealed. 3 files exported.</div>
        ) : null}
        {phase === 'done' && decision === 'reject' ? (
          <div className="rounded border border-alert-300 bg-alert-500/10 p-3 text-sm text-alert-600">Rejected by human. Agent stopped. Reason captured in audit.</div>
        ) : null}

        <div className="flex gap-2">
          <button onClick={run} disabled={phase === 'running'} className={'relative rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:bg-foreground/80 disabled:opacity-50 ' + (phase === 'idle' ? 'animate-pulse' : '')}>
            {phase === 'running' ? 'Running...' : phase === 'done' ? 'Run again' : 'Run the agent'}
          </button>
          {phase !== 'idle' ? (
            <button onClick={() => { clear(); setPhase('idle'); setSteps([]); setAudit([]); setDecision(null); }} className="rounded-md border border-border px-4 py-2 text-sm">Reset</button>
          ) : null}
        </div>
      </div>

      <div className="space-y-3">
        <div className="rounded-lg border bg-card p-3 text-xs">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-medium">Runtime</span>
            <span className="text-[10px] text-muted-foreground">{phase === 'idle' ? 'last run' : 'live'}</span>
          </div>
          <dl className="grid grid-cols-2 gap-2">
            <div><dt className="text-ink-muted">Cost</dt><dd className="font-mono text-ink">{'$' + (phase === 'idle' ? TOTALS.usd.toFixed(4) : cost.usd.toFixed(4))}</dd></div>
            <div><dt className="text-ink-muted">Latency</dt><dd className="font-mono text-ink">{(phase === 'idle' ? TOTALS.latencyMs : cost.latencyMs) + ' ms'}</dd></div>
            <div><dt className="text-ink-muted">Tokens in</dt><dd className="font-mono text-ink">{(phase === 'idle' ? TOTALS.tokensIn : cost.tokensIn).toLocaleString()}</dd></div>
            <div><dt className="text-ink-muted">Tokens out</dt><dd className="font-mono text-ink">{(phase === 'idle' ? TOTALS.tokensOut : cost.tokensOut).toLocaleString()}</dd></div>
          </dl>
          <div className="mt-3">
            <div className="flex justify-between"><span className="text-ink-muted">Confidence</span><span>{(phase === 'idle' ? 95 : pct).toFixed(0) + '%'}</span></div>
            <div className="mt-1 h-2 w-full rounded bg-muted">
              <div className={'h-2 rounded ' + (pct < 40 ? 'bg-alert-500' : pct < 70 ? 'bg-cargo-500' : 'bg-clear-500')} style={{ width: (phase === 'idle' ? 95 : pct) + '%' }} />
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="flex items-center justify-between border-b px-3 py-2 text-xs">
            <span className="font-medium">Immutable audit chain</span>
            <span className="text-muted-foreground">{audit.length + ' entries'}</span>
          </div>
          <ol className="max-h-80 divide-y overflow-auto">
            {audit.length === 0 ? (
              <li className="p-2 text-xs">
                {SAMPLE_AUDIT.map((e, i) => (
                  <div key={i} className="flex items-center gap-2 py-1.5 opacity-70">
                    <span className={'rounded-full px-2 py-0.5 text-[10px] font-medium ' + (e.actor === 'agent' ? 'bg-foreground text-background' : e.actor === 'human' ? 'bg-muted text-foreground' : 'border text-muted-foreground')}>{e.actor}</span>
                    <span className="truncate font-mono">{e.action}</span>
                    <span className="ml-auto font-mono text-[10px] text-muted-foreground/70">{e.hash}</span>
                  </div>
                ))}
                <div className="mt-1 truncate font-mono text-[10px] text-muted-foreground/70">{'prev ' + SAMPLE_AUDIT[SAMPLE_AUDIT.length - 1].prevHash + ' · ' + SAMPLE_AUDIT[SAMPLE_AUDIT.length - 1].target}</div>
              </li>
            ) : audit.map((e, i) => (
              <li key={i} className="p-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className={'rounded-full px-2 py-0.5 text-[10px] font-medium ' + (e.actor === 'agent' ? 'bg-foreground text-background' : e.actor === 'human' ? 'bg-muted text-foreground' : 'border text-muted-foreground')}>{e.actor}</span>
                  <span className="truncate font-mono">{e.action}</span>
                  <span className="ml-auto font-mono text-[10px] text-muted-foreground/70">{e.hash}</span>
                </div>
                <div className="mt-0.5 truncate font-mono text-[10px] text-muted-foreground/70">{'prev ' + e.prevHash + ' · ' + e.target}</div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
export default LiveAgentDemo;
