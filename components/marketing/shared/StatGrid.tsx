import * as React from 'react';

export interface StatGridProps {
  items: { label: string; value: string; hint?: string }[];
  columns?: 2 | 3 | 4;
}

export function StatGrid({ items, columns = 4 }: StatGridProps) {
  const grid = columns === 2 ? 'md:grid-cols-2' : columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4';
  return (
    <dl className={'grid grid-cols-2 gap-4 ' + grid}>
      {items.map((i) => (
        <div key={i.label} className="rounded-lg border bg-card p-4">
          <dd className="text-2xl font-semibold">{i.value}</dd>
          <dt className="mt-1 text-xs text-muted-foreground">{i.label}</dt>
          {i.hint ? <p className="mt-1 text-xs text-muted-foreground/70">{i.hint}</p> : null}
        </div>
      ))}
    </dl>
  );
}
export default StatGrid;
