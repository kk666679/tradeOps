'use client';

import * as React from 'react';

export interface TwinTaskBoardProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

export function TwinTaskBoard({ className, children }: TwinTaskBoardProps) {
  return (
    <div className={className} data-component="TwinTaskBoard">
      {children ?? 'TwinTaskBoard'}
    </div>
  );
}

export default TwinTaskBoard;
