'use client';

import * as React from 'react';

export interface TwinBondedLayerProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

export function TwinBondedLayer({ className, children }: TwinBondedLayerProps) {
  return (
    <div className={className} data-component="TwinBondedLayer">
      {children ?? 'TwinBondedLayer'}
    </div>
  );
}

export default TwinBondedLayer;
