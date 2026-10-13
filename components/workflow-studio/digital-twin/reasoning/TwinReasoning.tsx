'use client';

import * as React from 'react';

export interface TwinReasoningProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

export function TwinReasoning({ className, children }: TwinReasoningProps) {
  return (
    <div className={className} data-component="TwinReasoning">
      {children ?? 'TwinReasoning'}
    </div>
  );
}

export default TwinReasoning;
