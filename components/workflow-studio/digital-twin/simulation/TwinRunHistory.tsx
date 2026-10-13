'use client';

import * as React from 'react';

export interface TwinRunHistoryProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

export function TwinRunHistory({ className, children }: TwinRunHistoryProps) {
  return (
    <div className={className} data-component="TwinRunHistory">
      {children ?? 'TwinRunHistory'}
    </div>
  );
}

export default TwinRunHistory;
