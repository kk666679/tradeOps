'use client';
import * as React from 'react';
export interface CargoEmptyStateProps { title?: string; hint?: string; action?: React.ReactNode; }
export function CargoEmptyState({ title = 'Nothing here', hint, action }: CargoEmptyStateProps) {
  return (
    <div className="flex flex-col ItemsCenter JustifyCenter gap-2 rounded border border-dashed p-10 text-center">
      <div className="text-base FontMedium">{title}</div>
      {hint ? <div className="text-sm text-muted-foreground">{hint}</div> : null}
      {action}
    </div>
  );
}
export default CargoEmptyState;
