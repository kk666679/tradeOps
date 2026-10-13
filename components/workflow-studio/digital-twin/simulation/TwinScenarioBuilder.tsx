'use client';

import * as React from 'react';

export interface TwinScenarioBuilderProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

export function TwinScenarioBuilder({ className, children }: TwinScenarioBuilderProps) {
  return (
    <div className={className} data-component="TwinScenarioBuilder">
      {children ?? 'TwinScenarioBuilder'}
    </div>
  );
}

export default TwinScenarioBuilder;
