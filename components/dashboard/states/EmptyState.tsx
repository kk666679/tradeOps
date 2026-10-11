'use client';
import * as React from 'react';
export interface EmptyStateProps { title?: string; hint?: string; action?: React.ReactNode; }
export function EmptyState({ title = 'Nothing here', hint, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded border border-dashed p-10 text-center">
      <div className="text-base font-medium">{title}</div>
      {hint ? <div className="text-sm text-muted-foreground">{hint}</div> : null}
      {action}
    </div>
  );
}
export default EmptyState;
