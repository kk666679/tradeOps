import * as React from 'react';
import { TONES, Tone } from './tone';

export interface PipelineStep { label: string; hint: string }

export interface PipelineGridProps {
  steps: PipelineStep[];
  tone?: Tone;
  zoneLabel?: string;
  zoneHint?: string;
}

export function PipelineGrid({ steps, tone = 'muted', zoneLabel, zoneHint }: PipelineGridProps) {
  const t = TONES[tone];
  return (
    <div>
      {zoneLabel ? (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className={'rounded-full px-3 py-1 text-xs font-medium ' + t.chip}>{zoneLabel}</span>
          {zoneHint ? <span className="text-xs text-muted-foreground">{zoneHint}</span> : null}
        </div>
      ) : null}
      <ol className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
        {steps.map((s, i) => (
          <li key={s.label} className={'rounded-lg border bg-card p-4 transition ' + t.hover}>
            <div className="flex items-center gap-2">
              <span className={'inline-flex items-center gap-2 rounded-full px-2 py-0.5 text-xs ' + t.chip}>
                <span className={'h-1.5 w-1.5 rounded-full ' + t.accent} />
                Step {i + 1}
              </span>
            </div>
            <div className="mt-2 text-sm font-medium">{s.label}</div>
            <p className="mt-1 text-xs text-muted-foreground">{s.hint}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
export default PipelineGrid;
