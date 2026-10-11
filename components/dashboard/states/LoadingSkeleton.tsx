'use client';
import * as React from 'react';
export interface LoadingSkeletonProps { rows?: number; }
export function LoadingSkeleton({ rows = 5 }: LoadingSkeletonProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-8 animate-pulse rounded bg-muted" />
      ))}
    </div>
  );
}
export default LoadingSkeleton;
