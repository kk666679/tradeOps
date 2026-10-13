'use client';

import * as React from 'react';

export interface TwinTaskInspectorProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

export function TwinTaskInspector({ className, children }: TwinTaskInspectorProps) {
  return (
    <div className={className} data-component="TwinTaskInspector">
      {children ?? 'TwinTaskInspector'}
    </div>
  );
}

export default TwinTaskInspector;
