'use client';
import * as React from 'react';

export interface HighlightTabProps { active?: boolean; label: string; onClick?: () => void; }
export function HighlightTab({ active, label, onClick }: HighlightTabProps) {
  return (
    <li>
      <button onClick={onClick} className={'w-full rounded px-3 py-2 text-left text-sm transition ' + (active ? 'bg-background font-medium shadow-sm' : 'hover:bg-background/60')}>{label}</button>
    </li>
  );
}
export default HighlightTab;
