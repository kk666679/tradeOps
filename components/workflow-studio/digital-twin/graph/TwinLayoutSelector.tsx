'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';

export type TwinLayout = 'force' | 'hierarchical' | 'radial' | 'geographic';

const LAYOUTS: { id: TwinLayout; label: string }[] = [
  { id: 'force',        label: 'Force' },
  { id: 'hierarchical', label: 'Hierarchy' },
  { id: 'radial',       label: 'Radial' },
  { id: 'geographic',   label: 'Map' },
];

interface Props { value: TwinLayout; onChange: (l: TwinLayout) => void; }

export function TwinLayoutSelector({ value, onChange }: Props) {
  return (
    <div className="inline-flex rounded-md border bg-card p-0.5">
      {LAYOUTS.map((l) => (
        <Button key={l.id} size="sm" variant={value === l.id ? 'default' : 'ghost'} onClick={() => onChange(l.id)}>
          {l.label}
        </Button>
      ))}
    </div>
  );
}
export default TwinLayoutSelector;
