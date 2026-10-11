'use client';
import * as React from 'react';
import { BomDiffView } from './BomDiffView';
export interface BomCompareProps { leftVersion?: string; rightVersion?: string; }
export function BomCompare({ leftVersion = 'v1.0', rightVersion = 'v1.1' }: BomCompareProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm">
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-mono">{leftVersion}</span>
        <span className="text-slate-400">vs</span>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-mono">{rightVersion}</span>
      </div>
      <BomDiffView />
    </div>
  );
}
export default BomCompare;
