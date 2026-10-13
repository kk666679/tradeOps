'use client';

import * as React from 'react';

export interface TwinCounterfactualViewProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

export function TwinCounterfactualView({ className, children }: TwinCounterfactualViewProps) {
  return (
    <div className={className} data-component="TwinCounterfactualView">
      {children ?? 'TwinCounterfactualView'}
    </div>
  );
}

export default TwinCounterfactualView;
