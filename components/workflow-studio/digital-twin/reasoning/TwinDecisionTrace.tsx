'use client';

import * as React from 'react';

export interface TwinDecisionTraceProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

export function TwinDecisionTrace({ className, children }: TwinDecisionTraceProps) {
  return (
    <div className={className} data-component="TwinDecisionTrace">
      {children ?? 'TwinDecisionTrace'}
    </div>
  );
}

export default TwinDecisionTrace;
