'use client';
import * as React from 'react';
export interface CargoLoadingSkeletonProps { rows?: number; }
export function CargoLoadingSkeleton({ rows = 5 }: CargoLoadingSkeletonProps) {
  return (
    <div className="SpaceY2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-8 AnimatePulse rounded bg-muted" />
      ))}
    </div>
  );
}
export default CargoLoadingSkeleton;
