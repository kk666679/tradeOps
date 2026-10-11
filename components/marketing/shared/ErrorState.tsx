import * as React from 'react';

export interface ErrorStateProps { title?: string; message?: string; action?: React.ReactNode }

export function ErrorState({ title = 'Something went wrong', message, action }: ErrorStateProps) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-900">
      <div className="font-medium">{title}</div>
      {message ? <p className="mt-1 text-xs">{message}</p> : null}
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
}
export default ErrorState;
