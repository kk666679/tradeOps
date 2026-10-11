'use client';
import * as React from 'react';

export interface HeroStatsItem { label: string; value: React.ReactNode; }
export interface HeroStatsProps { items?: HeroStatsItem[]; }
export function HeroStats({ items = [] }: HeroStatsProps) {
  if (!items.length) return null;
  return (
    <dl className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
      {items.map((i, k) => (
        <div key={k}>
          <dd className="text-lg font-semibold">{i.value}</dd>
          <dt className="text-xs text-muted-foreground">{i.label}</dt>
        </div>
      ))}
    </dl>
  );
}
export default HeroStats;
