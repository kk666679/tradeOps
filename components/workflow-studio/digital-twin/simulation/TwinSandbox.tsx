'use client';

import * as React from 'react';

export interface TwinSandboxProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

export function TwinSandbox({ className, children }: TwinSandboxProps) {
  return (
    <div className={className} data-component="TwinSandbox">
      {children ?? 'TwinSandbox'}
    </div>
  );
}

export default TwinSandbox;
