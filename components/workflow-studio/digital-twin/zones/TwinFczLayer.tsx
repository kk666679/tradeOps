'use client';

import * as React from 'react';

export interface TwinFczLayerProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

export function TwinFczLayer({ className, children }: TwinFczLayerProps) {
  return (
    <div className={className} data-component="TwinFczLayer">
      {children ?? 'TwinFczLayer'}
    </div>
  );
}

export default TwinFczLayer;
