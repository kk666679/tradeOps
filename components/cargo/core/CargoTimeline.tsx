'use client';
import * as React from 'react';
export interface CargoTimelineEntry { id: string; at: string; title: string; detail?: string; zone?: 'FIZ' | 'FCZ'; actor?: string; }
export interface CargoTimelineProps { entries?: CargoTimelineEntry[]; }
export function CargoTimeline({ entries = [] }: CargoTimelineProps) {
  return (
    <ol className="relative Ml3 border-l">
      {entries.map((e) => (
        <li key={e.id} className="Mb4 Ml4">
          <div className={'absolute -Left1.5 Mt1.5 h-3 w-3 rounded-full ' + (e.zone === 'FIZ' ? 'bg-sky-500' : e.zone === 'FCZ' ? 'bg-amber-500' : 'bg-primary')} />
          <time className="text-xs text-muted-foreground">{e.at}{e.actor ? ' · ' + e.actor : ''}</time>
          <div className="FontMedium">{e.title}</div>
          {e.detail ? <div className="text-sm text-muted-foreground">{e.detail}</div> : null}
        </li>
      ))}
      {entries.length === 0 ? <li className="Ml4 text-sm text-muted-foreground">No events</li> : null}
    </ol>
  );
}
export default CargoTimeline;
