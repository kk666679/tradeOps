import * as React from 'react';

export interface EmptyStateProps {
  title?: string;
  hint?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title = 'Nothing here', hint, action, className }: EmptyStateProps) {
  return (
    <div className={'flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-10 text-center ' + (className ?? '')}>
      <div className="text-base font-medium">{title}</div>
      {hint ? <div className="text-sm text-slate-500">{hint}</div> : null}
      {action}
    </div>
  );
}
export default EmptyState;
