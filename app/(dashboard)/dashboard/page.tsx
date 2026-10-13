import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

/* ============================================================================
 * METADATA
 * ========================================================================= */

export const metadata: Metadata = {
  title: 'Dashboard — TradeOps',
  description:
    'Operational overview: cargo in transit, declarations, bonded balance, agent runs, SLA, and exceptions across all zones.',
};

export const dynamic = 'force-dynamic';

/* ============================================================================
 * ICONS
 * ========================================================================= */

type IconProps = React.SVGProps<SVGSVGElement>;

function SvgIcon({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

const Icon = {
  Container: (p: IconProps) => (
    <SvgIcon {...p}>
      <rect x="3" y="6" width="18" height="12" rx="1" />
      <path d="M7 6v12M12 6v12M17 6v12" />
    </SvgIcon>
  ),
  File: (p: IconProps) => (
    <SvgIcon {...p}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8M8 17h5" />
    </SvgIcon>
  ),
  Lock: (p: IconProps) => (
    <SvgIcon {...p}>
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </SvgIcon>
  ),
  Clock: (p: IconProps) => (
    <SvgIcon {...p}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </SvgIcon>
  ),
  Alert: (p: IconProps) => (
    <SvgIcon {...p}>
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </SvgIcon>
  ),
  Cpu: (p: IconProps) => (
    <SvgIcon {...p}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" />
    </SvgIcon>
  ),
  Arrow: (p: IconProps) => (
    <SvgIcon strokeWidth={2} {...p}>
      <path d="M4 10h12M11 5l5 5-5 5" />
    </SvgIcon>
  ),
  ArrowUp: (p: IconProps) => (
    <SvgIcon {...p}>
      <path d="M12 19V5M5 12l7-7 7 7" />
    </SvgIcon>
  ),
  ArrowDown: (p: IconProps) => (
    <SvgIcon {...p}>
      <path d="M12 5v14M19 12l-7 7-7-7" />
    </SvgIcon>
  ),
  Check: (p: IconProps) => (
    <SvgIcon {...p}>
      <polyline points="20 6 9 17 4 12" />
    </SvgIcon>
  ),
  Ship: (p: IconProps) => (
    <SvgIcon {...p}>
      <path d="M2 20h20M4 16 3 9h18l-1 7" />
      <path d="M12 3v6M8 6l4-3 4 3" />
    </SvgIcon>
  ),
  Warehouse: (p: IconProps) => (
    <SvgIcon {...p}>
      <path d="M2 20V9l10-5 10 5v11" />
      <path d="M6 20v-8h12v8" />
      <path d="M10 20v-4h4v4" />
    </SvgIcon>
  ),
  Truck: (p: IconProps) => (
    <SvgIcon {...p}>
      <rect x="1" y="6" width="15" height="12" rx="1" />
      <path d="M16 10h4l3 4v4h-7z" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
    </SvgIcon>
  ),
  Gate: (p: IconProps) => (
    <SvgIcon {...p}>
      <path d="M4 22V4M20 22V4M4 8h16M4 16h16M8 4v18M16 4v18" />
    </SvgIcon>
  ),
  Shield: (p: IconProps) => (
    <SvgIcon {...p}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </SvgIcon>
  ),
  Sparkle: (p: IconProps) => (
    <SvgIcon {...p}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
    </SvgIcon>
  ),
  Globe: (p: IconProps) => (
    <SvgIcon {...p}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </SvgIcon>
  ),
  Chart: (p: IconProps) => (
    <SvgIcon {...p}>
      <path d="M3 3v18h18" />
      <path d="M7 15l4-4 4 4 5-6" />
    </SvgIcon>
  ),
  Settings: (p: IconProps) => (
    <SvgIcon {...p}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </SvgIcon>
  ),
};

/* ============================================================================
 * DATA
 * ========================================================================= */

type Trend = { value: string; direction: 'up' | 'down' | 'flat'; tone: 'good' | 'bad' | 'neutral' };

type Kpi = {
  id: string;
  label: string;
  value: string;
  unit?: string;
  trend?: Trend;
  href: string;
  icon: keyof typeof Icon;
};

const KPIS: readonly Kpi[] = [
  {
    id: 'consignments',
    label: 'Active consignments',
    value: '412',
    trend: { value: '+7.4%', direction: 'up', tone: 'good' },
    href: '/cargo',
    icon: 'Container',
  },
  {
    id: 'declarations',
    label: 'Declarations pending',
    value: '38',
    trend: { value: '-12', direction: 'down', tone: 'good' },
    href: '/trade-ops/declarations',
    icon: 'File',
  },
  {
    id: 'bonded',
    label: 'Bonded balance',
    value: 'MYR 4.82',
    unit: 'M',
    trend: { value: '+2.1%', direction: 'up', tone: 'neutral' },
    href: '/wms/bonded',
    icon: 'Lock',
  },
  {
    id: 'sla',
    label: 'Clearance SLA',
    value: '99.95',
    unit: '%',
    trend: { value: 'target 99.90%', direction: 'flat', tone: 'good' },
    href: '/dashboard/sla',
    icon: 'Clock',
  },
  {
    id: 'agents',
    label: 'Agent runs (24h)',
    value: '1,204',
    trend: { value: '+14%', direction: 'up', tone: 'good' },
    href: '/custom-agents',
    icon: 'Cpu',
  },
  {
    id: 'exceptions',
    label: 'Open exceptions',
    value: '17',
    trend: { value: '+3 since 09:00', direction: 'up', tone: 'bad' },
    href: '/dashboard/alerts',
    icon: 'Alert',
  },
];

type AttentionItem = {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  detail: string;
  href: string;
  ctaLabel: string;
};

const ATTENTION: readonly AttentionItem[] = [
  {
    id: 'a1',
    severity: 'critical',
    title: '2 declarations rejected by JKDM',
    detail: 'HS code mismatch on line items 4 and 7. Awaiting correction and resubmission.',
    href: '/trade-ops/declarations',
    ctaLabel: 'Review',
  },
  {
    id: 'a2',
    severity: 'warning',
    title: 'Bonded balance threshold breached',
    detail: 'Zone FCZ-01 crossed 85% of the duty-suspension ceiling.',
    href: '/wms/bonded/aging',
    ctaLabel: 'Open ledger',
  },
  {
    id: 'a3',
    severity: 'warning',
    title: 'Agent run blocked',
    detail: 'Customs agent awaiting PGA licence reference for HS 8517.62.',
    href: '/custom-agents/registry',
    ctaLabel: 'Inspect',
  },
  {
    id: 'a4',
    severity: 'info',
    title: 'Webhook deliveries delayed',
    detail: 'Two subscribers have backlogs older than 30 minutes.',
    href: '/integration/webhook/deliveries',
    ctaLabel: 'View',
  },
];

type OpsRow = {
  id: string;
  label: string;
  value: string;
  delta: string;
  tone: 'good' | 'bad' | 'neutral';
  href: string;
};

const OPERATIONS_ROWS: readonly OpsRow[] = [
  { id: 'inbound',    label: 'Inbound ASNs today',     value: '48',   delta: '+6',  tone: 'good',    href: '/wms/inbound' },
  { id: 'outbound',   label: 'Outbound dispatches',    value: '37',   delta: '+3',  tone: 'good',    href: '/wms/outbound' },
  { id: 'gate',       label: 'Gate movements',         value: '291',  delta: '+12%', tone: 'good',   href: '/wms/gate' },
  { id: 'slotting',   label: 'Slot utilization',       value: '73%',  delta: '-2%', tone: 'neutral', href: '/wms/slotting' },
  { id: 'movements',  label: 'Inter-zone transfers',   value: '19',   delta: '+4',  tone: 'neutral', href: '/wms/movement/inter-zone' },
  { id: 'holds',      label: 'Inventory holds',        value: '6',    delta: '+1',  tone: 'bad',     href: '/wms/inventory/holds' },
];

const CUSTOMS_ROWS: readonly OpsRow[] = [
  { id: 'submitted',  label: 'Submitted (24h)',         value: '84',  delta: '+9',   tone: 'good',    href: '/trade-ops/declarations' },
  { id: 'cleared',    label: 'Cleared (24h)',           value: '76',  delta: '+6',   tone: 'good',    href: '/trade-ops/clearance' },
  { id: 'inspection', label: 'Inspections requested',   value: '5',   delta: '+2',   tone: 'bad',     href: '/trade-ops/clearance/inspection' },
  { id: 'detention',  label: 'In detention',            value: '3',   delta: '0',    tone: 'neutral', href: '/trade-ops/clearance/detention' },
  { id: 'fta',        label: 'FTA preference applied',  value: '41',  delta: '+8',   tone: 'good',    href: '/trade-ops/compliance/origin' },
  { id: 'duty',       label: 'Duty collected',          value: 'MYR 218k', delta: '+4%', tone: 'neutral', href: '/trade-ops/duty-calculator' },
];

type AgentRow = {
  id: string;
  label: string;
  value: string;
  status: 'healthy' | 'degraded' | 'blocked';
  href: string;
};

const AGENT_ROWS: readonly AgentRow[] = [
  { id: 'running',   label: 'Runs in flight',        value: '14',    status: 'healthy',  href: '/custom-agents/orchestration/runs' },
  { id: 'success',   label: 'Success rate (24h)',    value: '97.2%', status: 'healthy',  href: '/custom-agents/analytics/throughput' },
  { id: 'blocked',   label: 'Blocked nodes',         value: '3',     status: 'blocked',  href: '/custom-agents/monitoring/incidents' },
  { id: 'drift',     label: 'Policy drift events',   value: '2',     status: 'degraded', href: '/custom-agents/monitoring/drift' },
  { id: 'cost',      label: 'LLM cost (24h)',        value: '$41.60', status: 'healthy', href: '/custom-agents/monitoring/cost' },
  { id: 'escalations', label: 'Human escalations',   value: '5',     status: 'degraded', href: '/custom-agents/supervision/escalations' },
];

type Activity = {
  id: string;
  at: string;
  actor: string;
  action: string;
  target: string;
  href: string;
  tone: 'good' | 'warning' | 'critical' | 'neutral';
};

const ACTIVITY: readonly Activity[] = [
  { id: 't1', at: '09:42', actor: 'aisha.rahman', action: 'submitted declaration', target: 'DECL-2026-10118', href: '/trade-ops/declarations', tone: 'good' },
  { id: 't2', at: '09:36', actor: 'customs-agent', action: 'flagged HS mismatch on', target: 'DECL-2026-10117', href: '/custom-agents/customs-agents/classification', tone: 'warning' },
  { id: 't3', at: '09:28', actor: 'daniel.okafor', action: 'recorded bonded transfer', target: 'FCZ-01 → FIZ-02', href: '/wms/movement/inter-zone', tone: 'neutral' },
  { id: 't4', at: '09:12', actor: 'gate-system', action: 'ANPR mismatch at', target: 'Gate 3', href: '/wms/gate/anpr', tone: 'critical' },
  { id: 't5', at: '08:55', actor: 'aisha.rahman', action: 'approved subcontract on', target: 'MO-2026-0042', href: '/order-management/manufacturing/subcontract', tone: 'good' },
  { id: 't6', at: '08:40', actor: 'integration', action: 'EDI delivery failed to', target: 'ASYCUDA', href: '/integration/edi/asycuda', tone: 'critical' },
];

type QuickLink = {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: keyof typeof Icon;
  accent: string;
};

const QUICK_LINKS: readonly QuickLink[] = [
  { id: 'wms',      label: 'Warehouse',       description: 'Inbound, outbound, inventory, gate, slotting.',           href: '/wms',                icon: 'Warehouse', accent: 'text-emerald-600 dark:text-emerald-500' },
  { id: 'trade',    label: 'Trade ops',       description: 'Declarations, clearance, permits, duty, finance.',        href: '/trade-ops',          icon: 'File',      accent: 'text-violet-600 dark:text-violet-400' },
  { id: 'cargo',    label: 'Cargo',           description: 'Consignments, bulk, FCZ, FIZ, hazmat.',                    href: '/cargo',              icon: 'Container', accent: 'text-blue-600 dark:text-blue-400' },
  { id: 'orders',   label: 'Orders',          description: 'Purchase, trading, manufacturing, fulfilment.',            href: '/order-management',   icon: 'Truck',     accent: 'text-amber-600 dark:text-amber-500' },
  { id: 'agents',   label: 'Custom agents',   description: 'Registry, orchestration, memory, supervision.',            href: '/custom-agents',      icon: 'Cpu',       accent: 'text-rose-600 dark:text-rose-400' },
  { id: 'twin',     label: 'Digital twin',    description: 'Live zones, simulation, reasoning, analytics.',            href: '/digital-twin',       icon: 'Globe',     accent: 'text-cyan-600 dark:text-cyan-400' },
  { id: 'integrations', label: 'Integrations', description: 'EDI, ERP, TMS, WMS, webhooks, health.',                   href: '/integration',        icon: 'Settings',  accent: 'text-slate-600 dark:text-slate-400' },
  { id: 'admin',    label: 'Admin',           description: 'Tenants, users, roles, rule packs, audit.',                href: '/admin',              icon: 'Shield',    accent: 'text-fuchsia-600 dark:text-fuchsia-400' },
];

/* ============================================================================
 * PRIMITIVES
 * ========================================================================= */

function Card({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-border/60 bg-card ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({
  title,
  action,
  icon,
}: {
  title: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/60 px-5 py-3">
      <div className="flex items-center gap-2">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      {action}
    </div>
  );
}

function CardLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      {children}
      <Icon.Arrow className="h-3 w-3" />
    </Link>
  );
}

const TONE_TEXT: Record<'good' | 'bad' | 'neutral', string> = {
  good: 'text-emerald-600 dark:text-emerald-500',
  bad: 'text-rose-600 dark:text-rose-400',
  neutral: 'text-muted-foreground',
};

const SEVERITY_STYLES: Record<AttentionItem['severity'], { badge: string; dot: string; label: string }> = {
  critical: { badge: 'border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400', dot: 'bg-rose-500', label: 'Critical' },
  warning:  { badge: 'border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-500', dot: 'bg-amber-500', label: 'Warning' },
  info:     { badge: 'border-sky-500/40 bg-sky-500/10 text-sky-600 dark:text-sky-400', dot: 'bg-sky-500', label: 'Info' },
};

const AGENT_STATUS_STYLES: Record<AgentRow['status'], { badge: string; label: string }> = {
  healthy:  { badge: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-500', label: 'Healthy' },
  degraded: { badge: 'border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-500', label: 'Degraded' },
  blocked:  { badge: 'border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400', label: 'Blocked' },
};

const ACTIVITY_TONE_STYLES: Record<Activity['tone'], string> = {
  good: 'bg-emerald-500',
  warning: 'bg-amber-500',
  critical: 'bg-rose-500',
  neutral: 'bg-muted-foreground/40',
};

function Section({
  id,
  title,
  description,
  action,
  children,
}: {
  id?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

/* ============================================================================
 * SUB-VIEWS
 * ========================================================================= */

function PageHeader() {
  return (
    <header className="border-b border-border/60 bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 sm:gap-4 sm:py-6 lg:flex-row lg:items-center lg:justify-between lg:px-6">
        <div>
<div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center">
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <span className="rounded-full border border-border/60 bg-muted/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              live
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Operational overview across warehouse, customs, cargo, and agents.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/trade-ops/declarations/new"
            className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg bg-foreground px-3.5 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 sm:min-h-10"
          >
            <Icon.File className="h-4 w-4" />
            New declaration
          </Link>
          <Link
            href="/cargo/new"
            className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-border/60 px-3.5 py-2 text-sm font-medium transition-colors hover:bg-muted sm:min-h-10"
          >
            <Icon.Container className="h-4 w-4" />
            New cargo
          </Link>
          <Link
            href="/order-management/purchase/new"
            className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-border/60 px-3.5 py-2 text-sm font-medium transition-colors hover:bg-muted sm:min-h-10"
          >
            <Icon.Truck className="h-4 w-4" />
            New order
          </Link>
        </div>
      </div>
    </header>
  );
}

function SampleDataBanner() {
  return (
    <div className="border-b border-amber-500/30 bg-amber-500/5 px-4 py-2 text-xs text-amber-700 dark:text-amber-400 lg:px-6">
      <div className="mx-auto flex max-w-7xl items-center gap-2">
        <Icon.Alert className="h-3.5 w-3.5 shrink-0" />
        <span>
          Figures shown are sample data pending live router hookup. See{' '}
          <Link href="/integration/health" className="underline underline-offset-2 hover:no-underline">
            integration health
          </Link>{' '}
          for connection status.
        </span>
      </div>
    </div>
  );
}

function KpiStrip() {
  return (
    <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      {KPIS.map((kpi) => {
        const KIcon = Icon[kpi.icon];
        const TrendIcon = kpi.trend?.direction === 'down' ? Icon.ArrowDown : Icon.ArrowUp;
        return (
          <Link
            key={kpi.id}
            href={kpi.href}
            className="group rounded-xl border border-border/60 bg-card p-4 transition-colors hover:border-foreground/20"
          >
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                <KIcon className="h-4 w-4" />
              </span>
              {kpi.trend && (
                <span className={`inline-flex items-center gap-0.5 text-[11px] font-medium ${TONE_TEXT[kpi.trend.tone]}`}>
                  {kpi.trend.direction !== 'flat' && <TrendIcon className="h-3 w-3" />}
                  {kpi.trend.value}
                </span>
              )}
            </div>
            <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {kpi.label}
            </p>
            <p className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-semibold tabular-nums">{kpi.value}</span>
              {kpi.unit && <span className="text-sm text-muted-foreground">{kpi.unit}</span>}
            </p>
          </Link>
        );
      })}
    </div>
  );
}

function AttentionRequired() {
  return (
    <Section
      title="Attention required"
      description="Items that need a decision or a manual intervention."
      action={<CardLink href="/dashboard/alerts">All alerts</CardLink>}
    >
      <div className="grid gap-3 md:grid-cols-2">
        {ATTENTION.map((item) => {
          const s = SEVERITY_STYLES[item.severity];
          return (
            <Link
              key={item.id}
              href={item.href}
              className="group block rounded-xl border border-border/60 bg-card p-4 transition-colors hover:border-foreground/20"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${s.dot}`} aria-hidden />
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
                  </div>
                </div>
                <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${s.badge}`}>
                  {s.label}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-3">
                <span className="text-xs text-muted-foreground">Open</span>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-foreground">
                  {item.ctaLabel}
                  <Icon.Arrow className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </Section>
  );
}

function OpsTable({ title, rows, href, cta }: { title: string; rows: readonly OpsRow[]; href: string; cta: string }) {
  return (
    <Card>
      <CardHeader
        title={title}
        action={<CardLink href={href}>{cta}</CardLink>}
      />
      <ul className="divide-y divide-border/40">
        {rows.map((row) => (
          <li key={row.id}>
            <Link
              href={row.href}
              className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-3 transition-colors hover:bg-muted/40 sm:px-5"
            >
              <span className="text-sm text-foreground/90">{row.label}</span>
              <span className="flex items-center gap-3">
                <span className="text-sm font-medium tabular-nums">{row.value}</span>
                <span className={`w-14 text-right text-xs tabular-nums ${TONE_TEXT[row.tone]}`}>
                  {row.delta}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function AgentsCard() {
  return (
    <Card>
      <CardHeader
        title="Agents & automation"
        icon={<Icon.Cpu className="h-4 w-4" />}
        action={<CardLink href="/custom-agents/monitoring">Monitoring</CardLink>}
      />
      <ul className="divide-y divide-border/40">
        {AGENT_ROWS.map((row) => {
          const s = AGENT_STATUS_STYLES[row.status];
          return (
            <li key={row.id}>
              <Link
                href={row.href}
                className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-4 py-3 transition-colors hover:bg-muted/40 sm:px-5"
              >
                <span className="text-sm text-foreground/90">{row.label}</span>
                <span className="flex items-center gap-3">
                  <span className="text-sm font-medium tabular-nums">{row.value}</span>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${s.badge}`}>
                    {s.label}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

function ActivityCard() {
  return (
    <Card>
      <CardHeader
        title="Recent activity"
        action={<CardLink href="/admin/audit-log">Audit log</CardLink>}
      />
      <ol className="divide-y divide-border/40">
        {ACTIVITY.map((entry) => (
          <li key={entry.id}>
            <Link
              href={entry.href}
              className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/40 sm:px-5"
            >
              <span
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${ACTIVITY_TONE_STYLES[entry.tone]}`}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm">
                  <span className="font-medium">{entry.actor}</span>{' '}
                  <span className="text-muted-foreground">{entry.action}</span>{' '}
                  <span className="font-mono text-xs text-foreground/90">{entry.target}</span>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">{entry.at}</p>
              </div>
              <Icon.Arrow className="mt-1 h-3 w-3 shrink-0 text-muted-foreground" />
            </Link>
          </li>
        ))}
      </ol>
    </Card>
  );
}

function QuickAccess() {
  return (
    <Section
      title="Quick access"
      description="Jump straight to a domain."
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK_LINKS.map((link) => {
          const LIcon = Icon[link.icon];
          return (
            <Link
              key={link.id}
              href={link.href}
              className="group rounded-xl border border-border/60 bg-card p-4 transition-shadow hover:shadow-md"
            >
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-muted/30">
                <LIcon className={`h-4 w-4 ${link.accent}`} />
              </div>
              <p className="mt-3 text-sm font-medium">{link.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{link.description}</p>
              <p className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-foreground">
                Open
                <Icon.Arrow className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </p>
            </Link>
          );
        })}
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60 bg-muted/20">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-6">
        <p>
          Data freshness: figures refresh on page load. For live deltas see the
          relevant domain page.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href="/dashboard/operations" className="underline underline-offset-2 hover:text-foreground">
            Operations view
          </Link>
          <Link href="/dashboard/customs" className="underline underline-offset-2 hover:text-foreground">
            Customs view
          </Link>
          <Link href="/dashboard/sla" className="underline underline-offset-2 hover:text-foreground">
            SLA
          </Link>
          <Link href="/integration/health" className="underline underline-offset-2 hover:text-foreground">
            System health
          </Link>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================================
 * PAGE
 * ========================================================================= */

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader />
      <SampleDataBanner />

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:space-y-10 sm:py-8 lg:px-6">
        <KpiStrip />

        <AttentionRequired />

        <Section
          title="Operations"
          description="Warehouse movement across inbound, outbound, and gate."
          action={<CardLink href="/dashboard/operations">Operations view</CardLink>}
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <OpsTable
              title="Warehouse"
              rows={OPERATIONS_ROWS}
              href="/wms"
              cta="Open WMS"
            />
            <OpsTable
              title="Customs & compliance"
              rows={CUSTOMS_ROWS}
              href="/trade-ops"
              cta="Open trade ops"
            />
          </div>
        </Section>

        <Section
          title="Agents & activity"
          description="Automation status and recent audited events."
          action={<CardLink href="/custom-agents">Custom agents</CardLink>}
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <AgentsCard />
            <ActivityCard />
          </div>
        </Section>

        <QuickAccess />
      </main>

      <Footer />
    </div>
  );
}
