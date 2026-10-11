'use client';
import * as React from 'react';
import { FAQItem } from './FAQItem';

export interface FAQItemData { q: string; a: string }
export interface FAQProps { items: FAQItemData[]; title?: string; className?: string }

export function FAQ({ items, title = 'Frequently asked', className }: FAQProps) {
  const [open, setOpen] = React.useState<number | null>(0);
  return (
    <section className={'border-b ' + (className ?? '')}>
      <div className="mx-auto max-w-3xl px-4 py-16">
        <header className="mb-8"><h2 className="text-3xl font-semibold">{title}</h2></header>
        <ul className="space-y-2">
          {items.map((it, i) => (
            <FAQItem key={i} q={it.q} a={it.a} defaultOpen={open === i} onOpenChange={(o) => setOpen(o ? i : null)} />
          ))}
        </ul>
      </div>
    </section>
  );
}
export default FAQ;
