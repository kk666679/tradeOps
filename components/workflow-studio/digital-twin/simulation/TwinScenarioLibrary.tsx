'use client';

import * as React from 'react';

export interface TwinScenarioLibraryProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

export function TwinScenarioLibrary({ className, children }: TwinScenarioLibraryProps) {
  return (
    <div className={className} data-component="TwinScenarioLibrary">
      {children ?? 'TwinScenarioLibrary'}
    </div>
  );
}

export default TwinScenarioLibrary;
