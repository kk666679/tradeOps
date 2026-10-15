'use client';
import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandLogo } from '@/components/branding/BrandLogo';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import { analyticsTracker } from '@/lib/analytics/navigationAnalytics';
import { APP_ROUTES, MARKETING_ROUTES } from '@/config/routes';

interface NavChild { label: string; href: string; hint?: string }
interface NavItem  { label: string; href: string; children?: NavChild[] }

const NAV: NavItem[] = [
  { label: 'Product', href: '/product', children: [
    { label: 'Trade OPS',        href: APP_ROUTES.tradeOps,       hint: 'Customs + agents' },
    { label: 'WMS · FIZ',        href: APP_ROUTES.wms,            hint: 'Free Industrial Zone' },
    { label: 'WMS · FCZ',        href: APP_ROUTES.fcz,            hint: 'Free Commercial Zone' },
    { label: 'Bonded Workflow',  href: APP_ROUTES.bondedWorkflow, hint: 'Bonded flow explorer' },
    { label: 'Order Management', href: APP_ROUTES.orders,         hint: 'Purchase to Fulfilment' },
    { label: 'Digital Twin',     href: APP_ROUTES.digitalTwin,    hint: 'Simulate before commit' },
    { label: 'Custom Agents',    href: APP_ROUTES.agents,         hint: 'Agent orchestration' },
  ]},
  { label: 'Solutions', href: '/solutions/fiz', children: [
    { label: 'FIZ operators',      href: APP_ROUTES.fiz,      hint: 'Manufacturing, duty-suspended' },
    { label: 'FCZ operators',      href: APP_ROUTES.fcz,      hint: 'Transhipment, entrepot' },
    { label: 'Bonded zones',       href: APP_ROUTES.bonded,   hint: 'Customs warehousing' },
    { label: 'Customs brokers',    href: APP_ROUTES.tradeOps, hint: 'File more, prep less' },
    { label: 'Order Management',   href: APP_ROUTES.orders,   hint: 'Multi-customer bonded' },
  ]},
  { label: 'Intelligence', href: APP_ROUTES.dashboard, children: [
    { label: 'Dashboard',     href: APP_ROUTES.dashboard,   hint: 'Command center' },
    { label: 'Digital Twin',  href: APP_ROUTES.digitalTwin, hint: 'Simulation & analytics' },
    { label: 'Custom Agents', href: APP_ROUTES.agents,      hint: 'Agent orchestration' },
  ]},
  { label: 'Workflow', href: APP_ROUTES.workflow, children: [
    { label: 'Studio',    href: APP_ROUTES.workflow,            hint: 'Author & run workflow graphs' },
    { label: 'Runs',      href: APP_ROUTES.workflowRuns,        hint: 'Execution history & monitoring' },
    { label: 'Datasets',  href: APP_ROUTES.workflowDatasets,    hint: 'Seed datasets & loop records' },
  ]},
  { label: 'Integrations', href: APP_ROUTES.integrations },
  { label: 'Settings', href: APP_ROUTES.settings },
];

/**
 * Responsive breakpoints:
 * xs: < 640px   (Mobile phones)
 * sm: 640px-767px (Mobile landscape, small tablets)
 * md: 768px-1023px (Tablets)
 * lg: 1024px-1279px (Small laptops)
 * xl: ≥ 1280px (Large desktops)
 */

export function MarketingNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = React.useState<string | null>(null);
  const [screenSize, setScreenSize] = React.useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
  
  // Initialize analytics on mount
  React.useEffect(() => {
    // This ensures the singleton is initialized on first component mount
    const _ = analyticsTracker.getSessionId();
  }, []);

  // Debounced route change tracking
  React.useEffect(() => {
    const debounceTimer = setTimeout(() => {
      analyticsTracker.trackRouteChange(pathname);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [pathname]);

  // Track mobile menu open/close
  React.useEffect(() => {
    if (open) {
      analyticsTracker.trackMenuOpen('mobile-menu');
    }
  }, [open]);

  // Track screen size for responsive behavior
  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setScreenSize('xs');
      else if (width < 768) setScreenSize('sm');
      else if (width < 1024) setScreenSize('md');
      else if (width < 1280) setScreenSize('lg');
      else setScreenSize('xl');
    };

    // Call on mount
    handleResize();
    
    // Debounce resize events
    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };
    
    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Close menu when screen size changes to lg or larger
  React.useEffect(() => {
    if (screenSize !== 'xs' && screenSize !== 'sm' && screenSize !== 'md') {
      setOpen(false);
      setMobileExpanded(null);
    }
  }, [screenSize]);

  // Check if a route is active (exact match or starts with path)
  const isActive = (href: string): boolean => {
    if (pathname === href) return true;
    if (href !== '/' && pathname?.startsWith(href + '/')) return true;
    return false;
  };

  // Check if any child of a nav item is active
  const hasActiveChild = (item: NavItem): boolean => {
    return item.children?.some((child) => isActive(child.href)) ?? false;
  };

  return (
    <header
      className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      onMouseLeave={() => setActive(null)}
    >
      {/* Main Navigation Bar */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-2 xs:px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 gap-2 sm:gap-3 md:gap-4">
        {/* Logo - Responsive sizing */}
        <Link 
          href="/" 
          className="flex items-center shrink-0" 
          aria-label="TradeOps Home"
        >
          {screenSize === 'xs' ? (
            <BrandLogo size="sm" variant="compact" priority />
          ) : (
            <BrandLogo size="md" variant="full" priority />
          )}
        </Link>

        {/* Desktop Navigation - Visible on lg+ (≥ 1024px) */}
        <ul className="hidden lg:flex gap-3 xl:gap-4 text-xs sm:text-sm flex-1 items-center px-2">
          {NAV.map((item) => {
            const itemActive = isActive(item.href) || hasActiveChild(item);
            return (
              <li
                key={item.label}
                className="relative"
                onMouseEnter={() => setActive(item.children ? item.label : null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-0.5 transition-colors whitespace-nowrap px-2 py-1.5 rounded',
                    itemActive
                      ? 'text-foreground font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {item.label}
                  {item.children ? <span className="text-[10px] text-muted-foreground/70">▾</span> : null}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Authentication entry points */}
        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 lg:gap-3 shrink-0">
          {/* Auth Buttons - Desktop only (lg+, ≥ 1024px) */}
          <div className="hidden lg:flex gap-1.5 xl:gap-2">
              <Link 
                href={MARKETING_ROUTES.signIn}
                className="rounded-md px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm text-muted-foreground hover:bg-accent transition-colors whitespace-nowrap"
              >
                Sign in
              </Link>
              <Link 
                href={MARKETING_ROUTES.demo}
                className="rounded-md bg-foreground px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-background transition-colors hover:bg-foreground/80 whitespace-nowrap"
              >
                Book demo
              </Link>
          </div>

          {/* Mobile Menu Toggle - Visible on md- (< 1024px) */}
          <button
            className="lg:hidden p-1.5 rounded-md hover:bg-accent transition-colors"
            aria-label={open ? 'Close application menu' : 'Open application menu'}
            aria-controls="application-mobile-menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Desktop Dropdown Menu - Visible on lg+ (≥ 1024px) */}
      {active ? (
        <div className="hidden lg:block absolute left-0 right-0 top-full border-b bg-background/95 backdrop-blur shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="mx-auto grid max-w-7xl gap-2.5 sm:gap-3 xl:gap-4 px-3 sm:px-4 py-3 sm:py-4 md:grid-cols-2 lg:grid-cols-3">
            {NAV.find((n) => n.label === active)?.children?.map((c) => {
              const childActive = isActive(c.href);
              return (
                <Link
                  key={c.href}
                  href={c.href}
                  className={cn(
                    'rounded-lg border p-2.5 sm:p-3 transition-colors',
                    childActive
                      ? 'border-primary/50 bg-primary/10'
                      : 'border-border bg-card hover:border-primary/40 hover:bg-primary/5'
                  )}
                >
                  <div className={cn('text-xs sm:text-sm font-medium', childActive ? 'text-primary' : '')}>
                    {c.label}
                  </div>
                  {c.hint ? <div className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{c.hint}</div> : null}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Mobile Menu - Visible on md- (< 1024px) */}
      {open ? (
        <div id="application-mobile-menu" className="lg:hidden border-t px-2 xs:px-3 sm:px-4 py-2 sm:py-3 bg-background/95 backdrop-blur max-h-[calc(100vh-64px)] overflow-y-auto">
          {/* Mobile Navigation Items */}
          <ul className="space-y-0.5 sm:space-y-1 text-sm mb-3 sm:mb-4">
            {NAV.map((item) => {
              const itemActive = isActive(item.href) || hasActiveChild(item);
              return (
                <li key={item.label} className="rounded-md">
                  {item.children ? (
                    <>
                      <button
                        onClick={() => setMobileExpanded((e) => (e === item.label ? null : item.label))}
                        className={cn(
                          'flex w-full items-center justify-between rounded-md px-2 sm:px-3 py-2 sm:py-2.5 text-left text-xs sm:text-sm transition-colors',
                          itemActive
                            ? 'text-foreground font-semibold bg-accent/50'
                            : 'text-muted-foreground hover:bg-accent/50'
                        )}
                      >
                        <span>{item.label}</span>
                        <span className="text-[10px]">{mobileExpanded === item.label ? '▾' : '▸'}</span>
                      </button>
                      {/* Mobile Submenu */}
                      {mobileExpanded === item.label ? (
                        <ul className="mt-1 ml-2 xs:ml-2.5 sm:ml-3 space-y-0.5 sm:space-y-1 border-l border-border/50 pl-2 sm:pl-3">
                          {item.children.map((c) => {
                            const childActive = isActive(c.href);
                            return (
                              <li key={c.href}>
                                <Link
                                  href={c.href}
                                  onClick={() => setOpen(false)}
                                  className={cn(
                                    'flex flex-col rounded-md px-2 sm:px-2.5 py-1.5 sm:py-2 transition-colors',
                                    childActive
                                      ? 'text-primary font-semibold'
                                      : 'text-muted-foreground hover:text-foreground'
                                  )}
                                >
                                  <span className="text-xs sm:text-sm">{c.label}</span>
                                  {c.hint ? (
                                    <span className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                                      {c.hint}
                                    </span>
                                  ) : null}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      ) : null}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'block rounded-md px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm transition-colors',
                        itemActive
                          ? 'text-foreground font-semibold bg-accent/50'
                          : 'text-muted-foreground hover:bg-accent/50'
                      )}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Mobile: User section and auth links */}
          <div className="border-t border-border/50 pt-2 sm:pt-3">
            <div className="flex flex-col gap-1.5 sm:gap-2">
                <Link 
                  href={MARKETING_ROUTES.signIn}
                  onClick={() => setOpen(false)} 
                  className="rounded-md border border-border px-2.5 sm:px-3 py-2 sm:py-2.5 text-center text-xs sm:text-sm text-muted-foreground hover:bg-accent/50 transition-colors"
                >
                  Sign in
                </Link>
                <Link 
                  href={MARKETING_ROUTES.demo}
                  onClick={() => setOpen(false)} 
                  className="rounded-md bg-foreground px-2.5 sm:px-3 py-2 sm:py-2.5 text-center text-xs sm:text-sm font-medium text-background transition-colors hover:bg-foreground/80"
                >
                  Book demo
                </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
export default MarketingNavbar;
