'use client';
import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BrandLogo } from '@/components/branding/BrandLogo';
import { MARKETING_ROUTES } from '@/config/routes';

const LINKS: [string, string][] = [
  ['Product', '/#product'],
  ['Workflow', MARKETING_ROUTES.workflow],
  ['FIZ', '/solutions/fiz'],
  ['FCZ', '/solutions/fcz'],
  ['Pricing', MARKETING_ROUTES.pricing],
  ['API docs', MARKETING_ROUTES.apiDocs],
  ['Customers', MARKETING_ROUTES.customers],
];

export interface MarketingNavbarProps { ctaHref?: string; ctaLabel?: string; }
export function MarketingNavbar({ ctaHref = '/demo', ctaLabel = 'Book a demo' }: MarketingNavbarProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center" aria-label="TradeOps Home">
          <BrandLogo size="md" variant="full" />
        </Link>
        <ul className="hidden gap-6 text-sm md:flex">
          {LINKS.map(([label, href]) => (
            <li key={href}><Link href={href} className="text-muted-foreground hover:text-foreground">{label}</Link></li>
          ))}
        </ul>
        <div className="hidden gap-2 md:flex">
          <Button asChild variant="ghost" size="sm"><Link href="/login">Sign in</Link></Button>
          <Button asChild size="sm"><Link href={ctaHref}>{ctaLabel}</Link></Button>
        </div>
        <button className="md:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="marketing-mobile-menu" onClick={() => setOpen((v) => !v)}>≡</button>
      </nav>
      {open ? (
        <div id="marketing-mobile-menu" className="border-t px-4 py-3 md:hidden">
          <ul className="space-y-2 text-sm">
            {LINKS.map(([label, href]) => (
              <li key={href}><Link href={href} onClick={() => setOpen(false)}>{label}</Link></li>
            ))}
          </ul>
          <div className="mt-3 flex gap-2">
            <Button asChild variant="ghost" size="sm"><Link href="/login">Sign in</Link></Button>
            <Button asChild size="sm"><Link href={ctaHref}>{ctaLabel}</Link></Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
export default MarketingNavbar;
