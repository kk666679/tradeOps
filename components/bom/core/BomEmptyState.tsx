'use client';
import * as React from 'react';
export interface BomEmptyStateProps { title?: string; hint?: string; action?: React.ReactNode; }
export function BomEmptyState({ title = 'No BOMs yet', hint = 'Create your first BOM or import from CSV.', action }: BomEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-10 text-center">
      <div className="text-base font-medium">{title}</div>
      <div className="text-sm text-slate-500">{hint}</div>
      {action}
    </div>
  );
}
export default BomEmptyState;
