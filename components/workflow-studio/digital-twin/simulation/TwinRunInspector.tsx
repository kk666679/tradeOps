'use client';

import * as React from 'react';

export interface TwinRunInspectorProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

export function TwinRunInspector({ className, children }: TwinRunInspectorProps) {
  return (
    <div className={className} data-component="TwinRunInspector">
      {children ?? 'TwinRunInspector'}
    </div>
  );
}

export default TwinRunInspector;
