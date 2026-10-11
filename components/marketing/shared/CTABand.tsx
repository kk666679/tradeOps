import * as React from 'react';
import Link from 'next/link';

export interface CTABandProps {
  title?: string;
  subtitle?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}

export function CTABand({
  title = 'Ready to run your FIZ / FCZ on one platform?',
  subtitle = 'Talk with our team about your zone topology and operating requirements.',
  primary = { label: 'Book a walkthrough', href: '/demo' },
  secondary = { label: 'Read API docs', href: '/api-docs' },
}: CTABandProps) {
  return (
    <section className="bg-muted/60">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-4 py-12 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-semibold">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={secondary.href} className="rounded-md border border-border bg-background px-5 py-2.5 text-sm font-medium transition hover:bg-accent">{secondary.label}</Link>
          <Link href={primary.href} className="rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:bg-foreground/80">{primary.label}</Link>
        </div>
      </div>
    </section>
  );
}
export default CTABand;
