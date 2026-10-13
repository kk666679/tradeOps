'use client';

import * as React from 'react';

export interface TwinRunControlsProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

export function TwinRunControls({ className, children }: TwinRunControlsProps) {
  return (
    <div className={className} data-component="TwinRunControls">
      {children ?? 'TwinRunControls'}
    </div>
  );
}

export default TwinRunControls;
