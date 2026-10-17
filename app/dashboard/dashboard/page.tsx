import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Dashboard — TradeOps',
  description: 'Operational overview: cargo, inventory, outbound, and compliance findings.',
};

export const dynamic = 'force-dynamic';

type IconProps = React.SVGProps<SVGSVGElement>;
function SvgIcon({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      {children}
    </svg>
  );
}
const Icon = {
  Container: (p: IconProps) => <SvgIcon {...p}><rect x="3" y="6" width="18" height="12" rx="1" /><path d="M7 6v12M12 6v12M17 6v12" /></SvgIcon>,
  File:      (p: IconProps) => <SvgIcon {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></SvgIcon>,
  Lock:      (p: IconProps) => <SvgIcon {...p}><rect x="3" y="11" width="18" height="10" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></SvgIcon>,
  Alert:     (p: IconProps) => <SvgIcon {...p}><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></SvgIcon>,
  Cpu:       (p: IconProps) => <SvgIcon {...p}><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" /></SvgIcon>,
  Arrow:     (p: IconProps) => <SvgIcon strokeWidth={2} {...p}><path d="M4 10h12M11 5l5 5-5 5" /></SvgIcon>,
  Warehouse: (p: IconProps) => <SvgIcon {...p}><path d="M2 20V9l10-5 10 5v11" /><path d="M6 20v-8h12v8" /><path d="M10 20v-4h4v4" /></SvgIcon>,
  Truck:     (p: IconProps) => <SvgIcon {...p}><rect x="1" y="6" width="15" height="12" rx="1" /><path d="M16 10h4l3 4v4h-7z" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></SvgIcon>,
  Shield:    (p: IconProps) => <SvgIcon {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></SvgIcon>,
  Globe:     (p: IconProps) => <SvgIcon {...p}><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></SvgIcon>,
  Settings:  (p: IconProps) => <SvgIcon {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></SvgIcon>,
};

/* ── server-side data fetch ─────────────────────────────────────────────── */

interface DashboardMetrics {
  inventoryCount: number;
  cargoCount: number;
  activeOutboundCount: number;
  warningCount: number;
}

async function fetchMetrics(): Promise<DashboardMetrics | null> {
  const base = process.env.BACKEND_URL ?? 'http://localhost:3001';
  try {
    const res = await fetch(
      `${base}/api/trpc/dashboard.getMetrics?batch=1&input=${encodeURIComponent(JSON.stringify({ '0': { json: undefined } }))}`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    const first = Array.isArray(data) ? data[0] : data;
    return (first?.result?.data?.json ?? first?.result?.data) as DashboardMetrics | null;
  } catch {
    return null;
  }
}

/* ── quick links (static navigation) ───────────────────────────────────── */

const QUICK_LINKS = [
  { id: 'wms',      label: 'Warehouse',      description: 'Inbound, outbound, inventory, gate, slotting.',    href: '/wms',              icon: 'Warehouse' as const, accent: 'text-emerald-600 dark:text-emerald-500' },
  { id: 'trade',    label: 'Trade ops',      description: 'Declarations, clearance, permits, duty, finance.', href: '/trade-ops',        icon: 'File'      as const, accent: 'text-violet-600 dark:text-violet-400' },
  { id: 'cargo',    label: 'Cargo',          description: 'Consignments, bulk, FCZ, FIZ, hazmat.',            href: '/cargo',            icon: 'Container' as const, accent: 'text-blue-600 dark:text-blue-400' },
  { id: 'orders',   label: 'Orders',         description: 'Purchase, trading, manufacturing, fulfilment.',    href: '/order-management', icon: 'Truck'     as const, accent: 'text-amber-600 dark:text-amber-500' },
  { id: 'agents',   label: 'Custom agents',  description: 'Registry, orchestration, memory, supervision.',    href: '/custom-agents',    icon: 'Cpu'       as const, accent: 'text-rose-600 dark:text-rose-400' },
  { id: 'twin',     label: 'Digital twin',   description: 'Live zones, simulation, reasoning, analytics.',    href: '/digital-twin',     icon: 'Globe'     as const, accent: 'text-cyan-600 dark:text-cyan-400' },
  { id: 'int',      label: 'Integrations',   description: 'EDI, ERP, TMS, WMS, webhooks, health.',            href: '/integration',      icon: 'Settings'  as const, accent: 'text-slate-600 dark:text-slate-400' },
  { id: 'admin',    label: 'Admin',          description: 'Tenants, users, roles, rule packs, audit.',        href: '/admin',            icon: 'Shield'    as const, accent: 'text-fuchsia-600 dark:text-fuchsia-400' },
] as const;

/* ── primitives ─────────────────────────────────────────────────────────── */

function CardLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
      {children}<Icon.Arrow className="h-3 w-3" />
    </Link>
  );
}

function Section({ title, description, action, children }: { title: string; description?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight">{title}</h2>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

/* ── KPI strip ──────────────────────────────────────────────────────────── */

function KpiStrip({ m }: { m: DashboardMetrics | null }) {
  const kpis = [
    { id: 'cargo',     label: 'Active cargo',     value: m?.cargoCount,          href: '/cargo',                icon: 'Container' as const },
    { id: 'inventory', label: 'Inventory lines',  value: m?.inventoryCount,      href: '/wms/inventory',        icon: 'Warehouse' as const },
    { id: 'outbound',  label: 'Active outbound',  value: m?.activeOutboundCount, href: '/wms/outbound',         icon: 'Truck'     as const },
    { id: 'findings',  label: 'Open findings',    value: m?.warningCount,        href: '/trade-ops/compliance', icon: 'Alert'     as const },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {kpis.map(({ id, label, value, href, icon }) => {
        const KIcon = Icon[icon];
        return (
          <Link key={id} href={href} className="group rounded-xl border border-border/60 bg-card p-4 transition-colors hover:border-foreground/20">
            <span className="text-muted-foreground"><KIcon className="h-4 w-4" /></span>
            <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className="mt-1 text-xl font-semibold tabular-nums">
              {value == null ? <span className="text-muted-foreground text-sm">—</span> : value.toLocaleString()}
            </p>
          </Link>
        );
      })}
    </div>
  );
}

/* ── quick access ───────────────────────────────────────────────────────── */

function QuickAccess() {
  return (
    <Section title="Quick access" description="Jump straight to a domain.">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK_LINKS.map((link) => {
          const LIcon = Icon[link.icon];
          return (
            <Link key={link.id} href={link.href} className="group rounded-xl border border-border/60 bg-card p-4 transition-shadow hover:shadow-md">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-muted/30">
                <LIcon className={`h-4 w-4 ${link.accent}`} />
              </div>
              <p className="mt-3 text-sm font-medium">{link.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{link.description}</p>
              <p className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-foreground">
                Open <Icon.Arrow className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </p>
            </Link>
          );
        })}
      </div>
    </Section>
  );
}

/* ── page ───────────────────────────────────────────────────────────────── */

export default async function Page() {
  const metrics = await fetchMetrics();

  return (
    <div className="min-h-screen bg-background">
      {/* header */}
      <header className="border-b border-border/60 bg-background">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 lg:flex-row lg:items-center lg:justify-between lg:px-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
              {metrics && (
                <span className="rounded-full border border-border/60 bg-muted/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">live</span>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Operational overview across warehouse, customs, cargo, and agents.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/trade-ops/declarations/new" className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3.5 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90">
              <Icon.File className="h-4 w-4" />New declaration
            </Link>
            <Link href="/cargo/new" className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 px-3.5 py-2 text-sm font-medium transition-colors hover:bg-muted">
              <Icon.Container className="h-4 w-4" />New cargo
            </Link>
            <Link href="/order-management/purchase/new" className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 px-3.5 py-2 text-sm font-medium transition-colors hover:bg-muted">
              <Icon.Truck className="h-4 w-4" />New order
            </Link>
          </div>
        </div>
      </header>

      {/* backend-unreachable banner — only shown when metrics fetch failed */}
      {!metrics && (
        <div className="border-b border-amber-500/30 bg-amber-500/5 px-4 py-2 text-xs text-amber-700 dark:text-amber-400 lg:px-6">
          <div className="mx-auto flex max-w-7xl items-center gap-2">
            <Icon.Alert className="h-3.5 w-3.5 shrink-0" />
            <span>
              Backend unreachable — metrics unavailable. Check{' '}
              <Link href="/integration/health" className="underline underline-offset-2 hover:no-underline">integration health</Link>.
            </span>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-7xl space-y-10 px-4 py-8 lg:px-6">
        <KpiStrip m={metrics} />

        <Section
          title="Operations"
          description="Navigate to a domain for detailed live data."
          action={<CardLink href="/wms">Open WMS</CardLink>}
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: 'Warehouse',   href: '/wms',                  icon: 'Warehouse' as const, desc: 'Inbound, outbound, gate, slotting, inventory.' },
              { label: 'Trade ops',   href: '/trade-ops',            icon: 'File'      as const, desc: 'Declarations, clearance, permits, duty.' },
              { label: 'Compliance',  href: '/trade-ops/compliance', icon: 'Shield'    as const, desc: metrics ? `${metrics.warningCount} open finding${metrics.warningCount !== 1 ? 's' : ''}.` : 'Open findings.' },
            ].map((item) => {
              const IIcon = Icon[item.icon];
              return (
                <Link key={item.href} href={item.href} className="group flex items-start gap-3 rounded-xl border border-border/60 bg-card p-4 transition-colors hover:border-foreground/20">
                  <span className="mt-0.5 text-muted-foreground"><IIcon className="h-4 w-4" /></span>
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </Section>

        <QuickAccess />
      </main>

      <footer className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-6">
          <p>Metrics refresh on page load (60 s server cache).</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/wms" className="underline underline-offset-2 hover:text-foreground">Warehouse</Link>
            <Link href="/trade-ops" className="underline underline-offset-2 hover:text-foreground">Trade ops</Link>
            <Link href="/integration/health" className="underline underline-offset-2 hover:text-foreground">System health</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
