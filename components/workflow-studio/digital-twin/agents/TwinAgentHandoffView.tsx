'use client';

import * as React from 'react';

export interface TwinAgentHandoffViewProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

export function TwinAgentHandoffView({ className, children }: TwinAgentHandoffViewProps) {
  return (
    <div className={className} data-component="TwinAgentHandoffView">
      {children ?? 'TwinAgentHandoffView'}
    </div>
  );
}

export default TwinAgentHandoffView;
