'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BrandLogo } from '@/components/branding/BrandLogo';
import { MARKETING_ROUTES } from '@/config/routes';

type NavLink = { label: string; href: string; description?: string };
type NavGroup = { label: string; links: NavLink[] };
type NavItem = { label: string; href?: string; group?: NavGroup };

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Product',
    group: {
      label: 'Platform capabilities',
      links: [
        { label: 'Trade OPS', href: '/product/trade-ops', description: 'Coordinate declarations, clearance, and compliance.' },
        { label: 'WMS FIZ', href: '/product/wms-fiz', description: 'Operate factory zones with full traceability.' },
        { label: 'WMS FCZ', href: '/product/wms-fcz', description: 'Manage free commercial zone flows.' },
        { label: 'Order Mgmt', href: '/product/order-management', description: 'Connect purchasing, trading, and fulfilment.' },
        { label: 'Digital Twin', href: '/product/digital-twin', description: 'Model operations, risk, and decisions in real time.' },
        { label: 'Custom Agents', href: '/product/custom-agents', description: 'Deploy governed automation for your team.' },
      ],
    },
  },
  {
    label: 'Solutions',
    group: {
      label: 'Built for your operation',
      links: [
        { label: 'FIZ Operators', href: '/solutions/fiz' },
        { label: 'FCZ Operators', href: '/solutions/fcz' },
        { label: 'Customs Brokers', href: '/solutions/brokers' },
        { label: 'CFS 3PL', href: '/solutions/cfs-3pl' },
        { label: 'Freight Forwarders', href: '/solutions/forwarders' },
      ],
    },
  },
  {
    label: 'Studio',
    group: {
      label: 'Build and run workflows',
      links: [
        { label: 'Workflow Studio', href: '/brokerage/workflow-studio', description: 'Design, test, and monitor operational workflows.' },
        { label: 'Workflow overview', href: MARKETING_ROUTES.workflow, description: 'See how TradeOps orchestration connects your stack.' },
        { label: 'Agent Builder', href: '/custom-agents/builder', description: 'Create governed agents from reusable capabilities.' },
        { label: 'Agent Orchestration', href: '/custom-agents/orchestration', description: 'Coordinate runs, queues, and human approvals.' },
      ],
    },
  },
  {
    label: 'Resources',
    group: {
      label: 'Learn and explore',
      links: [
        { label: 'API Docs', href: '/api-docs' },
        { label: 'Changelog', href: '/changelog' },
        { label: 'Newsletter', href: '/newletters' },
        { label: 'Customers', href: '/customers' },
      ],
    },
  },
  { label: 'Contact', href: MARKETING_ROUTES.contact },
];

export interface MarketingNavbarProps { ctaHref?: string; ctaLabel?: string; }

export function MarketingNavbar({ ctaHref = MARKETING_ROUTES.demo, ctaLabel = 'Book a demo' }: MarketingNavbarProps) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState<string | null>(null);
  const navRef = React.useRef<HTMLElement>(null);
  const menuRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const groupIsActive = (group: NavGroup) => group.links.some((link) => isActive(link.href));
  const closeMenus = React.useCallback(() => { setExpanded(null); setOpen(false); }, []);

  React.useEffect(() => {
    setExpanded(null);
    setOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) closeMenus();
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [closeMenus]);

  const toggleGroup = (label: string) => setExpanded((current) => current === label ? null : label);
  const handleGroupKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, item: NavItem) => {
    if (!item.group) return;
    if (event.key === 'Escape') { setExpanded(null); return; }
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setExpanded(item.label);
      requestAnimationFrame(() => menuRefs.current[item.label]?.focus());
    }
  };

  return (
    <header ref={navRef} className="sticky top-0 z-40 border-b border-border/70 bg-background/90 shadow-sm backdrop-blur-xl">
      <nav aria-label="Primary navigation" className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href={MARKETING_ROUTES.home} className="shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="TradeOps home">
          <BrandLogo size="md" variant="full" />
        </Link>
        <div className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => item.group ? (
            <div key={item.label} className="relative" onMouseEnter={() => setExpanded(item.label)} onMouseLeave={() => setExpanded(null)}>
              <button ref={(element) => { menuRefs.current[item.label] = element; }} type="button" aria-expanded={expanded === item.label} aria-haspopup="menu" aria-current={groupIsActive(item.group) ? 'page' : undefined} onClick={() => toggleGroup(item.label)} onKeyDown={(event) => handleGroupKeyDown(event, item)} className={`inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${groupIsActive(item.group) ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}>
                {item.label}<ChevronDown className={`size-4 transition-transform ${expanded === item.label ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
              {expanded === item.label && <div role="menu" aria-label={`${item.label} menu`} className="absolute left-0 top-full mt-2 w-80 rounded-xl border border-border/80 bg-popover p-2 shadow-xl" onMouseEnter={() => setExpanded(item.label)}>
                <p className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{item.group.label}</p>
                <div className="grid gap-0.5">
                  {item.group.links.map((link) => <Link key={link.href} role="menuitem" href={link.href} onClick={closeMenus} className={`rounded-lg px-3 py-2.5 transition-colors hover:bg-muted ${isActive(link.href) ? 'bg-muted' : ''}`}><span className="block text-sm font-medium text-popover-foreground">{link.label}</span>{link.description && <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">{link.description}</span>}</Link>)}
                </div>
              </div>}
            </div>
          ) : <Link key={item.label} href={item.href!} className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${isActive(item.href!) ? 'bg-muted text-foreground' : 'text-muted-foreground'}`} aria-current={isActive(item.href!) ? 'page' : undefined}>{item.label}</Link>)}
        </div>
        <div className="hidden items-center gap-2 lg:flex"><Button asChild variant="ghost" size="sm"><Link href={MARKETING_ROUTES.login}>Sign in</Link></Button><Button asChild size="sm"><Link href={ctaHref}>{ctaLabel}<ArrowUpRight data-icon="inline-end" /></Link></Button></div>
        <Button type="button" variant="ghost" size="icon" className="lg:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="marketing-mobile-menu" onClick={() => setOpen((value) => !value)}>{open ? <X /> : <Menu />}</Button>
      </nav>
      {open && <div id="marketing-mobile-menu" className="border-t bg-background px-4 py-4 shadow-lg lg:hidden"><div className="mx-auto flex max-w-7xl flex-col gap-1">
        {NAV_ITEMS.map((item) => item.group ? <div key={item.label} className="rounded-lg border border-border/60 p-1"><button type="button" className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium hover:bg-muted ${groupIsActive(item.group) ? 'text-foreground' : 'text-muted-foreground'}`} aria-expanded={expanded === item.label} onClick={() => toggleGroup(item.label)}>{item.label}<ChevronDown className={`size-4 transition-transform ${expanded === item.label ? 'rotate-180' : ''}`} aria-hidden="true" /></button>{expanded === item.label && <div className="grid gap-1 pb-1">{item.group.links.map((link) => <Link key={link.href} href={link.href} onClick={closeMenus} className={`rounded-md px-3 py-2 text-sm hover:bg-muted hover:text-foreground ${isActive(link.href) ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}>{link.label}</Link>)}</div>}</div> : <Link key={item.label} href={item.href!} onClick={closeMenus} className={`rounded-md px-3 py-2 text-sm font-medium hover:bg-muted ${isActive(item.href!) ? 'bg-muted text-foreground' : 'text-muted-foreground'}`} aria-current={isActive(item.href!) ? 'page' : undefined}>{item.label}</Link>)}
        <div className="mt-3 flex flex-col gap-2 border-t pt-4 sm:flex-row"><Button asChild variant="outline" className="sm:flex-1"><Link href={MARKETING_ROUTES.login}>Sign in</Link></Button><Button asChild className="sm:flex-1"><Link href={ctaHref}>{ctaLabel}<ArrowUpRight data-icon="inline-end" /></Link></Button></div>
      </div></div>}
    </header>
  );
}

export default MarketingNavbar;
