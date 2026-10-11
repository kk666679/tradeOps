'use client';
import * as React from 'react';
import { StatsCard } from './StatsCard';

export interface StatsGridItem { label: string; value: number | string; suffix?: string; }
export interface StatsGridProps { items: StatsGridItem[]; }
export function StatsGrid({ items }: StatsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
      {items.map((i, k) => <StatsCard key={k} {...i} />)}
    </div>
  );
}
export default StatsGrid;
