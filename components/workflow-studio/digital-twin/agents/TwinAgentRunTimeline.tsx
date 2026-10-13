'use client';

import * as React from 'react';

export interface TwinAgentRunTimelineProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

export function TwinAgentRunTimeline({ className, children }: TwinAgentRunTimelineProps) {
  return (
    <div className={className} data-component="TwinAgentRunTimeline">
      {children ?? 'TwinAgentRunTimeline'}
    </div>
  );
}

export default TwinAgentRunTimeline;
