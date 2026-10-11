'use client';
import * as React from 'react';
import { TestimonialCarousel, type TestimonialCarouselItem } from './TestimonialCarousel';

const ITEMS = [
  { id: 't1', quote: 'We cut declaration prep time by 70%. The FIZ agent knows our schemes.', author: 'Head of Customs', org: 'FIZ Electronics Park' },
  { id: 't2', quote: 'Transhipment finally has an end-to-end ledger. Duty-suspension visibility is a game changer.', author: 'COO', org: 'FCZ Transhipment Hub' },
  { id: 't3', quote: 'The digital twin let us simulate gate congestion before peak season. No surprises.', author: 'Ops Director', org: 'CFS 3PL' },
  { id: 't4', quote: 'Agent approvals flow into our audit trail. Customs is happy. We are happy.', author: 'Compliance Lead', org: 'Bonded CFS' },
];

export interface TestimonialsProps {
  items?: TestimonialCarouselItem[];
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function Testimonials({
  items = ITEMS,
  title = 'Operators ship more with CFS FIZ/FCZ',
  subtitle,
  children,
}: TestimonialsProps) {
  return (
    <section className="border-b">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <header className="mb-8 max-w-2xl">
          <h2 className="text-3xl font-semibold">{title}</h2>
          {subtitle ? <p className="mt-2 text-muted-foreground">{subtitle}</p> : null}
        </header>
        <TestimonialCarousel items={items} />
        {children}
      </div>
    </section>
  );
}
export default Testimonials;
