'use client';
import * as React from 'react';
export interface LogoGridProps { names?: string[]; }
export function LogoGrid({ names = [] }: LogoGridProps) {
  return (
    <ul className="grid grid-cols-2 items-center gap-4 md:grid-cols-6">
      {names.map((n) => (
        <li key={n} className="flex h-12 items-center justify-center rounded border bg-background px-3 text-center text-xs text-muted-foreground">{n}</li>
      ))}
    </ul>
  );
}
export default LogoGrid;
