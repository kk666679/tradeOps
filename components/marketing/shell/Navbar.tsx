'use client';
import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BrandLogo } from '@/components/branding/BrandLogo';
import { Menu, X } from 'lucide-react';
import { MARKETING_ROUTES } from '@/config/routes';
import { ThemeToggle } from '@/components/ThemeToggle';

const LINKS: [string, string][] = [
  ['Product', '/#product'],
  ['Workflow', MARKETING_ROUTES.workflow],
  ['FIZ', '/solutions/fiz'],
  ['FCZ', '/solutions/fcz'],
  ['Studio', '/brokerage/workflow-studio'],
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
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm"><Link href="/login">Sign in</Link></Button>
          <Button asChild size="sm"><Link href={ctaHref}>{ctaLabel}</Link></Button>
        </div>
        <button className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-foreground hover:bg-muted transition-colors" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="marketing-mobile-menu" onClick={() => setOpen((v) => !v)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>
      {open ? (
        <div id="marketing-mobile-menu" className="border-t px-4 py-3 md:hidden bg-background/95 backdrop-blur">
          <ul className="space-y-2 text-sm">
            {LINKS.map(([label, href]) => (
              <li key={href}><Link href={href} onClick={() => setOpen(false)} className="block w-full text-muted-foreground hover:text-foreground px-2 py-2 rounded-lg">{label}</Link></li>
            ))}
          </ul>
          <div className="mt-3 flex gap-2">
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm"><Link href="/login" className="w-full">Sign in</Link></Button>
            <Button asChild size="sm"><Link href={ctaHref} className="w-full">{ctaLabel}</Link></Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
export default MarketingNavbar;
