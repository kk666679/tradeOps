'use client';
import * as React from 'react';
import { StatsGrid, type StatsGridItem } from './StatsGrid';

const STATS = [
  { label: 'Zones live', value: '40+' },
  { label: 'Declarations/mo', value: '120k' },
  { label: 'Agent actions', value: '2.1M' },
  { label: 'Bonded stock', value: '$2.4B' },
  { label: 'Uptime', value: '99.98%' },
  { label: 'Integrations', value: '30+' },
];

export function Stats({ stats = STATS }: { stats?: StatsGridItem[] }) {
  return (
    <section className="border-b">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <StatsGrid items={stats} />
      </div>
    </section>
  );
}

export default Stats;
