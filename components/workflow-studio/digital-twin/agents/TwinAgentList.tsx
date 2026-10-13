'use client';

import * as React from 'react';

export interface TwinAgentListProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

export function TwinAgentList({ className, children }: TwinAgentListProps) {
  return (
    <div className={className} data-component="TwinAgentList">
      {children ?? 'TwinAgentList'}
    </div>
  );
}

export default TwinAgentList;
