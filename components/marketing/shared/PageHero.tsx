import * as React from 'react';
import Link from 'next/link';

export interface PageHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  compact?: boolean;
  children?: React.ReactNode;
}

export function PageHero({ eyebrow, title, subtitle, primary, secondary, compact, children }: PageHeroProps) {
  return (
    <section className={(compact ? 'py-12 md:py-16' : 'py-16 md:py-24') + ' border-b bg-gradient-to-b from-background to-muted'}>
      <div className="mx-auto max-w-7xl px-4">
        <div className={children ? 'grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center' : ''}>
          <div>
            {eyebrow ? (
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-clear-500" />
                {eyebrow}
              </div>
            ) : null}
            <h1 className={(compact ? 'text-3xl md:text-4xl' : 'text-4xl md:text-5xl') + ' font-semibold leading-tight'}>
              {title}
            </h1>
            {subtitle ? <p className="mt-4 max-w-2xl text-muted-foreground">{subtitle}</p> : null}
            {(primary || secondary) ? (
              <div className="mt-6 flex flex-wrap gap-3">
                {primary ? (
                  <Link href={primary.href} className="rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:bg-foreground/80">
                    {primary.label} →
                  </Link>
                ) : null}
                {secondary ? (
                  <Link href={secondary.href} className="rounded-md border border-border bg-background px-5 py-2.5 text-sm font-medium transition hover:bg-accent">
                    {secondary.label}
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>
          {children ? <div>{children}</div> : null}
        </div>
      </div>
    </section>
  );
}
export default PageHero;
