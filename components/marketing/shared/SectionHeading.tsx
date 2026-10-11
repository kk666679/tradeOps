import * as React from 'react';

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  children?: React.ReactNode;
}

export function SectionHeading({ eyebrow, title, subtitle, align = 'left', children }: SectionHeadingProps) {
  return (
    <header className={'mb-8 ' + (align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl')}>
      {eyebrow ? <div className="mb-2 text-xs font-medium uppercase tracking-wide text-primary">{eyebrow}</div> : null}
      <h2 className="text-3xl font-semibold">{title}</h2>
      {subtitle ? <p className="mt-2 text-muted-foreground">{subtitle}</p> : null}
      {children}
    </header>
  );
}
export default SectionHeading;
