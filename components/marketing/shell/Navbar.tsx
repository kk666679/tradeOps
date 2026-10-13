'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BrandLogo } from '@/components/branding/BrandLogo';
import { MARKETING_ROUTES } from '@/config/routes';

const LINKS = [
  { label: 'Product', href: '/#product' },
  { label: 'Workflow', href: MARKETING_ROUTES.workflow },
  { label: 'Solutions', children: [
    ['FIZ', '/solutions/fiz'], ['FCZ', '/solutions/fcz'], ['Customs brokers', '/solutions/brokers'],
  ] },
  { label: 'Studio', href: '/brokerage/workflow-studio' },
  { label: 'Pricing', href: MARKETING_ROUTES.pricing },
  { label: 'Resources', children: [['API docs', MARKETING_ROUTES.apiDocs], ['Customers', MARKETING_ROUTES.customers], ['Changelog', MARKETING_ROUTES.changelog]] },
] as const;

export interface MarketingNavbarProps { ctaHref?: string; ctaLabel?: string; }

export function MarketingNavbar({ ctaHref = MARKETING_ROUTES.demo, ctaLabel = 'Book a demo' }: MarketingNavbarProps) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState<string | null>(null);
  const isActive = (href: string) => href.startsWith('/#') ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  React.useEffect(() => { setOpen(false); setExpanded(null); }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 shadow-sm backdrop-blur-xl">
      <nav aria-label="Primary navigation" className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href={MARKETING_ROUTES.home} className="shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="TradeOps home">
          <BrandLogo size="md" variant="full" />
        </Link>
        <div className="hidden items-center gap-1 lg:flex">
          {LINKS.map((item) => item.children ? (
            <div key={item.label} className="relative">
              <button type="button" aria-expanded={expanded === item.label} aria-haspopup="menu" onClick={() => setExpanded(expanded === item.label ? null : item.label)} className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {item.label}<ChevronDown className="size-4" aria-hidden="true" />
              </button>
              {expanded === item.label && <div role="menu" className="absolute left-0 top-full mt-2 min-w-48 rounded-lg border bg-popover p-1.5 shadow-lg">
                {item.children.map(([label, href]) => <Link key={href} role="menuitem" href={href} onClick={() => setExpanded(null)} className="block rounded-md px-3 py-2 text-sm text-popover-foreground hover:bg-muted">{label}</Link>)}
              </div>}
            </div>
          ) : <Link key={item.label} href={item.href} className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${isActive(item.href) ? 'bg-muted text-foreground' : 'text-muted-foreground'}`} aria-current={isActive(item.href) ? 'page' : undefined}>{item.label}</Link>)}
        </div>
        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="ghost" size="sm"><Link href={MARKETING_ROUTES.login}>Sign in</Link></Button>
          <Button asChild size="sm"><Link href={ctaHref}>{ctaLabel}<ArrowUpRight data-icon="inline-end" /></Link></Button>
        </div>
        <Button type="button" variant="ghost" size="icon" className="lg:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="marketing-mobile-menu" onClick={() => setOpen((value) => !value)}>{open ? <X /> : <Menu />}</Button>
      </nav>
      {open && <div id="marketing-mobile-menu" className="border-t bg-background px-4 py-4 shadow-lg lg:hidden">
        <div className="mx-auto flex max-w-7xl flex-col gap-1">
          {LINKS.map((item) => item.children ? <div key={item.label} className="rounded-lg border border-border/60 p-1"><button type="button" className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium hover:bg-muted" aria-expanded={expanded === item.label} onClick={() => setExpanded(expanded === item.label ? null : item.label)}>{item.label}<ChevronDown className="size-4" /></button>{expanded === item.label && <div className="grid gap-1 pb-1">{item.children.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">{label}</Link>)}</div>}</div> : <Link key={item.label} href={item.href} onClick={() => setOpen(false)} className={`rounded-md px-3 py-2 text-sm font-medium hover:bg-muted ${isActive(item.href) ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}>{item.label}</Link>)}
          <div className="mt-3 flex flex-col gap-2 border-t pt-4 sm:flex-row"><Button asChild variant="outline" className="sm:flex-1"><Link href={MARKETING_ROUTES.login}>Sign in</Link></Button><Button asChild className="sm:flex-1"><Link href={ctaHref}>{ctaLabel}<ArrowUpRight data-icon="inline-end" /></Link></Button></div>
        </div>
      </div>}
    </header>
  );
}

export default MarketingNavbar;
