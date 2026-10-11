import * as React from 'react';

export interface LoadingStateProps { rows?: number; className?: string }

export function LoadingState({ rows = 5, className }: LoadingStateProps) {
  return (
    <div className={'space-y-2 ' + (className ?? '')}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-10 animate-pulse rounded bg-slate-100" />
      ))}
    </div>
  );
}
export default LoadingState;
