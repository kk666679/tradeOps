'use client';
import * as React from 'react';
import Link from 'next/link';

export interface NavDrawerProps { open: boolean; onClose: () => void; links?: [string, string][]; }
export function NavDrawer({ open, onClose, links = [] }: NavDrawerProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/40" onClick={onClose}>
      <aside className="absolute right-0 top-0 h-full w-72 bg-background p-4" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between"><span className="font-semibold">Menu</span><button onClick={onClose}>✕</button></div>
        <ul className="space-y-2 text-sm">
          {links.map(([label, href]) => <li key={href}><Link href={href} onClick={onClose}>{label}</Link></li>)}
        </ul>
      </aside>
    </div>
  );
}
export default NavDrawer;
