'use client';
import * as React from 'react';
export interface TestimonialQuoteProps { quote: string; author: string; org?: string; }
export function TestimonialQuote({ quote, author, org }: TestimonialQuoteProps) {
  return (
    <blockquote className="mx-auto max-w-3xl text-center">
      <p className="text-2xl font-medium leading-snug">“{quote}”</p>
      <footer className="mt-4 text-sm text-muted-foreground">— {author}{org ? ', ' + org : ''}</footer>
    </blockquote>
  );
}
export default TestimonialQuote;
