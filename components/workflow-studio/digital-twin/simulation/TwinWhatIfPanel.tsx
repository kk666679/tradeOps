'use client';

import * as React from 'react';

export interface TwinWhatIfPanelProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

export function TwinWhatIfPanel({ className, children }: TwinWhatIfPanelProps) {
  return (
    <div className={className} data-component="TwinWhatIfPanel">
      {children ?? 'TwinWhatIfPanel'}
    </div>
  );
}

export default TwinWhatIfPanel;
