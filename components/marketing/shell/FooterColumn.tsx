'use client';
import * as React from 'react';
import Link from 'next/link';

export interface FooterColumnProps { title: string; links: [string, string][]; }
export function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <div className="text-xs uppercase text-muted-foreground">{title}</div>
      <ul className="mt-2 space-y-1 text-sm">
        {links.map(([label, href]) => <li key={href}><Link href={href} className="hover:text-foreground">{label}</Link></li>)}
      </ul>
    </div>
  );
}
export default FooterColumn;
