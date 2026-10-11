'use client';
import * as React from 'react';
import { FeatureCard } from './FeatureCard';

export interface FeatureGridFeature { id: string; title: string; body: string; href?: string; }
export interface FeatureGridProps { features: FeatureGridFeature[]; }
export function FeatureGrid({ features }: FeatureGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {features.map((f) => <FeatureCard key={f.id} {...f} />)}
    </div>
  );
}
export default FeatureGrid;
