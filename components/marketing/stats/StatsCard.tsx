'use client';
import * as React from 'react';
import { StatsCounter } from './StatsCounter';

export interface StatsCardProps { label: string; value: number | string; suffix?: string; }
export function StatsCard({ label, value, suffix }: StatsCardProps) {
  return (
    <div className="rounded border p-4">
      <div className="text-2xl font-semibold">{typeof value === 'number' ? <StatsCounter to={value} suffix={suffix} /> : value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
export default StatsCard;
