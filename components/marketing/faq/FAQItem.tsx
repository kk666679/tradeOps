'use client';
import * as React from 'react';

export interface FAQItemProps { q: string; a: string; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void }

export function FAQItem({ q, a, defaultOpen, onOpenChange }: FAQItemProps) {
  const [open, setOpen] = React.useState(!!defaultOpen);
  return (
    <li className="rounded border bg-card">
      <button className="flex w-full items-center justify-between p-4 text-left text-sm font-medium" onClick={() => { const next = !open; setOpen(next); onOpenChange?.(next); }} aria-expanded={open}>
        <span>{q}</span>
        <span className="text-muted-foreground">{open ? '−' : '+'}</span>
      </button>
      {open ? <div className="px-4 pb-4 text-sm text-muted-foreground">{a}</div> : null}
    </li>
  );
}
export default FAQItem;
