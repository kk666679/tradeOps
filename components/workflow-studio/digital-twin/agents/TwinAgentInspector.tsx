'use client';

import * as React from 'react';

export interface TwinAgentInspectorProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

export function TwinAgentInspector({ className, children }: TwinAgentInspectorProps) {
  return (
    <div className={className} data-component="TwinAgentInspector">
      {children ?? 'TwinAgentInspector'}
    </div>
  );
}

export default TwinAgentInspector;
