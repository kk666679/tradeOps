'use client';

import * as React from 'react';

export interface TwinExplainabilityPanelProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

export function TwinExplainabilityPanel({ className, children }: TwinExplainabilityPanelProps) {
  return (
    <div className={className} data-component="TwinExplainabilityPanel">
      {children ?? 'TwinExplainabilityPanel'}
    </div>
  );
}

export default TwinExplainabilityPanel;
