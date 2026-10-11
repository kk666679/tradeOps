'use client';
import * as React from 'react';
export interface GateAnprFeedHit { plate: string; at: string; lane: string; confidence: number; }
export interface GateAnprFeedProps { hits?: GateAnprFeedHit[]; }
export function GateAnprFeed({ hits = [] }: GateAnprFeedProps) {
  return (
    <div className="rounded border p-3">
      <div className="mb-2 text-sm font-medium">ANPR Feed</div>
      {hits.length === 0 ? <p className="text-xs text-muted-foreground">No hits</p> :
        <ul className="space-y-1 text-xs">
          {hits.map((h, i) => (
            <li key={i} className="flex justify-between"><span className="font-mono">{h.plate}</span><span>lane {h.lane}</span><span>{(h.confidence * 100).toFixed(0)}%</span><span className="text-muted-foreground">{h.at}</span></li>
          ))}
        </ul>}
    </div>
  );
}
export default GateAnprFeed;
