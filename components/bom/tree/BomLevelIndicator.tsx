'use client';
import * as React from 'react';
export interface BomLevelIndicatorProps { level: number; max?: number; }
export function BomLevelIndicator({ level, max = 5 }: BomLevelIndicatorProps) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={'h-2 w-2 rounded-full ' + (i < level ? 'bg-sky-500' : 'bg-slate-200')} />
      ))}
    </span>
  );
}
export default BomLevelIndicator;
