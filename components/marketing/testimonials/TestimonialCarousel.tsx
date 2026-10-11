'use client';
import * as React from 'react';
import { TestimonialCard } from './TestimonialCard';

export interface TestimonialCarouselItem { id: string; quote: string; author: string; org?: string; }
export interface TestimonialCarouselProps { items: TestimonialCarouselItem[]; }
export function TestimonialCarousel({ items }: TestimonialCarouselProps) {
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % items.length), 6000);
    return () => clearInterval(id);
  }, [items.length]);
  const cur = items[i];
  return (
    <div className="space-y-3">
      <TestimonialCard {...cur} />
      <div className="flex gap-2">
        {items.map((_, k) => (
          <button key={k} onClick={() => setI(k)} className={'h-2 w-2 rounded-full ' + (k === i ? 'bg-primary' : 'bg-muted')} aria-label={'slide ' + (k + 1)} />
        ))}
      </div>
    </div>
  );
}
export default TestimonialCarousel;
