'use client';

import * as React from 'react';

export interface TwinTaskQueueProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

export function TwinTaskQueue({ className, children }: TwinTaskQueueProps) {
  return (
    <div className={className} data-component="TwinTaskQueue">
      {children ?? 'TwinTaskQueue'}
    </div>
  );
}

export default TwinTaskQueue;
