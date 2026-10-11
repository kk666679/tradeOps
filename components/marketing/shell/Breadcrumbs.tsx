'use client';
import * as React from 'react';
import Link from 'next/link';

export interface BreadcrumbsProps { items: { label: string; href?: string }[]; }
export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="text-xs text-muted-foreground">
      <ol className="flex items-center gap-2">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-2">
            {it.href ? <Link href={it.href} className="hover:text-foreground">{it.label}</Link> : <span>{it.label}</span>}
            {i < items.length - 1 ? <span>/</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
export default Breadcrumbs;
