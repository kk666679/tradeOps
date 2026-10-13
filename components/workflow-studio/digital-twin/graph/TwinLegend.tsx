'use client';
import * as React from 'react';

const ITEMS = [
  { kind: 'supplier', label: 'Supplier',  color: '#8b5cf6' },
  { kind: 'plant',    label: 'Plant',     color: '#0ea5e9' },
  { kind: 'dc',       label: 'DC',        color: '#f59e0b' },
  { kind: 'customer', label: 'Customer',  color: '#10b981' },
] as const;

export function TwinLegend() {
  return (
    <ul className="flex flex-wrap gap-3 text-xs">
      {ITEMS.map((i) => (
        <li key={i.kind} className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: i.color }} />
          <span className="text-muted-foreground">{i.label}</span>
        </li>
      ))}
    </ul>
  );
}
export default TwinLegend;
