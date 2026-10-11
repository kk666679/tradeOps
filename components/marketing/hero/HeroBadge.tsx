'use client';
import * as React from 'react';
import { Badge } from '@/components/ui/badge';

export interface HeroBadgeProps { children: React.ReactNode; href?: string; }
export function HeroBadge({ children, href }: HeroBadgeProps) {
  return (
    <a href={href ?? '#'} className="inline-flex">
      <Badge variant="secondary" className="gap-2 px-3 py-1 text-xs">{children}<span>→</span></Badge>
    </a>
  );
}
export default HeroBadge;
