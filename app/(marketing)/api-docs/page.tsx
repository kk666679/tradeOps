import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

/* ============================================================================
 * CONFIG
 * ========================================================================= */

const SITE_URL = 'https://tradeops.example';
const API_BASE_URL = 'https://api.tradeops.example/v1';
const PAGE_URL = `${SITE_URL}/api-docs`;
const STATUS_URL = 'https://status.tradeops.example';
const API_VERSION = 'v1';
const UPTIME_SLA = '99.95%';
const SDK_REPO_TS = 'https://github.com/tradeops/tradeops-typescript';
const SDK_REPO_PY = 'https://github.com/tradeops/tradeops-python';
const SDK_REPO_GO = 'https://github.com/tradeops/tradeops-go';

const PAGE_TITLE = 'API Documentation — TradeOps';
const PAGE_DESCRIPTION =
  'Programmatic access to cargo, inventory, declarations, HS classification, ' +
  'bonded ledger, and audit records. OpenAPI 3.1, scoped keys, webhooks, and ' +
  'official TypeScript, Python, and Go SDKs.';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: 'website',
    url: PAGE_URL,
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    siteName: 'TradeOps',
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const dynamic = 'force-static';

/* ============================================================================
 * TYPES
 * ========================================================================= */

type NavSection = { id: string; label: string };

type ResourceGroup = {
  id: string;
  name: string;
  description: string;
  endpoints: string[];
  scopes: string[];
  href: string;
  referenceHref: string;
  accent: string;
  icon: 'cargo' | 'inventory' | 'declaration' | 'tariff' | 'bonded' | 'audit';
};

type RateLimitTier = {
  tier: string;
  requests: string;
  burst: string;
  notes: string;
};

type WebhookEvent = {
  event: string;
  description: string;
  payload: string;
};

type ErrorCode = {
  code: string;
  http: string;
  meaning: string;
  action: string;
};

type Sdk = {
  language: string;
  package: string;
  install: string;
  repository: string;
  accent: string;
};

type ScopeRow = { scope: string; description: string };

type DeprecationRow = { phase: string; window: string; notes: string };

/* ============================================================================
 * DATA
 * ========================================================================= */

const NAV_SECTIONS: readonly NavSection[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'quickstart', label: 'Quick start' },
  { id: 'authentication', label: 'Authentication' },
  { id: 'resources', label: 'Resources' },
  { id: 'rate-limits', label: 'Rate limits' },
  { id: 'idempotency', label: 'Idempotency' },
  { id: 'webhooks', label: 'Webhooks' },
  { id: 'errors', label: 'Errors' },
  { id: 'versioning', label: 'Versioning' },
  { id: 'security', label: 'Security' },
  { id: 'sla', label: 'SLA & support' },
  { id: 'sdks', label: 'SDKs' },
];

const RESOURCE_GROUPS: readonly ResourceGroup[] = [
  {
    id: 'cargo',
    name: 'Cargo',
    description:
      'Consignments, shipments, containers, and package-level tracking. The primary resource for everything moving through a facility.',
    endpoints: [
      'GET    /cargo',
      'GET    /cargo/{id}',
      'POST   /cargo',
      'PATCH  /cargo/{id}',
      'GET    /cargo/{id}/events',
    ],
    scopes: ['cargo:read', 'cargo:write'],
    href: '#resources-cargo',
    referenceHref: '/cargo',
    accent: 'text-blue-600 dark:text-blue-400',
    icon: 'cargo',
  },
  {
    id: 'inventory',
    name: 'Inventory',
    description:
      'Stock levels, locations, lot and serial tracking, and stock movements. Regime-aware — bonded, duty-paid, transhipment, and drawback are separate stock pools.',
    endpoints: [
      'GET    /inventory',
      'GET    /inventory/{sku}',
      'POST   /inventory/movements',
      'GET    /inventory/regimes',
    ],
    scopes: ['inventory:read', 'inventory:write'],
    href: '#resources-inventory',
    referenceHref: '/wms/inventory',
    accent: 'text-emerald-600 dark:text-emerald-500',
    icon: 'inventory',
  },
  {
    id: 'declarations',
    name: 'Declarations',
    description:
      'Declaration preparation, submission tracking, and status. Submission to the customs authority is a separate, audited action.',
    endpoints: [
      'GET    /declarations',
      'POST   /declarations',
      'GET    /declarations/{id}',
      'POST   /declarations/{id}/submit',
      'GET    /declarations/{id}/audit-trail',
    ],
    scopes: ['declarations:read', 'declarations:write', 'declarations:submit'],
    href: '#resources-declarations',
    referenceHref: '/trade-ops/declarations',
    accent: 'text-violet-600 dark:text-violet-400',
    icon: 'declaration',
  },
  {
    id: 'classification',
    name: 'HS classification',
    description:
      'Tariff lookup, rate resolution, control-list checks, and FTA eligibility. Every rate carries a source and a retrieval date.',
    endpoints: [
      'GET    /tariff/{code}',
      'POST   /tariff/search',
      'POST   /tariff/resolve-rate',
      'POST   /tariff/calculate-tax',
    ],
    scopes: ['tariff:read'],
    href: '#resources-classification',
    referenceHref: '/trade-ops/hs-classification',
    accent: 'text-amber-600 dark:text-amber-500',
    icon: 'tariff',
  },
  {
    id: 'bonded',
    name: 'Bonded ledger',
    description:
      'Bonded balance, movement records, exemption tracking, and drawback recovery. The append-only ledger of duty-suspended goods.',
    endpoints: [
      'GET    /bonded/balance',
      'POST   /bonded/movements',
      'GET    /bonded/exemptions',
      'POST   /bonded/drawback-claims',
    ],
    scopes: ['bonded:read', 'bonded:write'],
    href: '#resources-bonded',
    referenceHref: '/wms/bonded',
    accent: 'text-rose-600 dark:text-rose-400',
    icon: 'bonded',
  },
  {
    id: 'audit',
    name: 'Audit',
    description:
      'Append-only audit log of every state transition. Query by actor, resource, timestamp, or event type.',
    endpoints: ['GET    /audit', 'GET    /audit/{id}', 'GET    /audit/export'],
    scopes: ['audit:read'],
    href: '#resources-audit',
    referenceHref: '/admin/audit-log',
    accent: 'text-slate-600 dark:text-slate-400',
    icon: 'audit',
  },
];

const RATE_LIMITS: readonly RateLimitTier[] = [
  {
    tier: 'Development',
    requests: '60 / min',
    burst: '120',
    notes: 'Sandbox only. Free, non-production tier.',
  },
  {
    tier: 'Standard',
    requests: '600 / min',
    burst: '1,200',
    notes: 'Default paid tier. Production-ready.',
  },
  {
    tier: 'Enterprise',
    requests: 'Custom',
    burst: 'Custom',
    notes: 'Negotiated per contract. Contact sales.',
  },
  {
    tier: 'Webhooks (inbound)',
    requests: 'No limit',
    burst: '—',
    notes: 'Retries with exponential backoff up to 72 h.',
  },
];

const WEBHOOK_EVENTS: readonly WebhookEvent[] = [
  {
    event: 'cargo.created',
    description: 'A new consignment or shipment has been registered.',
    payload: 'consignment',
  },
  {
    event: 'cargo.status.changed',
    description: 'A cargo status transition occurred.',
    payload: 'consignment + previous_status',
  },
  {
    event: 'inventory.movement',
    description: 'A stock movement was recorded, including regime transitions.',
    payload: 'movement',
  },
  {
    event: 'declaration.prepared',
    description: 'A draft declaration is awaiting submission.',
    payload: 'declaration',
  },
  {
    event: 'declaration.submitted',
    description: 'A declaration was submitted to the customs authority.',
    payload: 'declaration + submission_ref',
  },
  {
    event: 'declaration.query',
    description: 'The customs authority raised a query on a declaration.',
    payload: 'query',
  },
  {
    event: 'bonded.balance.threshold',
    description: 'A bonded balance crossed a configured threshold.',
    payload: 'balance_alert',
  },
  {
    event: 'audit.entry',
    description: 'An audited state transition occurred.',
    payload: 'audit_entry',
  },
];

const ERROR_CODES: readonly ErrorCode[] = [
  {
    code: 'validation_error',
    http: '400',
    meaning: 'The request body or query parameters failed validation.',
    action: 'Read the `errors` array for field-level detail.',
  },
  {
    code: 'authentication_failed',
    http: '401',
    meaning: 'The API key is missing, malformed, or revoked.',
    action: 'Verify the key in the dashboard. Rotate if compromised.',
  },
  {
    code: 'insufficient_scope',
    http: '403',
    meaning: 'The API key does not have the required scope.',
    action: 'Grant the required scope in the dashboard.',
  },
  {
    code: 'not_found',
    http: '404',
    meaning: 'The resource does not exist or is not visible to your tenant.',
    action: 'Verify the id and confirm you are using the correct tenant key.',
  },
  {
    code: 'rate_limit_exceeded',
    http: '429',
    meaning: 'Too many requests. The response includes `Retry-After`.',
    action: 'Back off per `Retry-After`. Do not retry immediately.',
  },
  {
    code: 'idempotency_conflict',
    http: '409',
    meaning: 'An Idempotency-Key was reused with a different request body.',
    action: 'Use a fresh key for a different request.',
  },
  {
    code: 'upstream_unavailable',
    http: '503',
    meaning: 'A downstream dependency is unavailable.',
    action: 'Retry with exponential backoff. Safe to retry.',
  },
  {
    code: 'internal_error',
    http: '500',
    meaning: 'An unexpected server error occurred.',
    action: 'Retry once. If it persists, contact support with `request_id`.',
  },
];

const SCOPES: readonly ScopeRow[] = [
  { scope: 'cargo:read', description: 'Read consignments, shipments, containers.' },
  { scope: 'cargo:write', description: 'Create, update, and cancel cargo records.' },
  { scope: 'inventory:read', description: 'Read stock levels, movements, and locations.' },
  { scope: 'inventory:write', description: 'Record stock movements and adjustments.' },
  { scope: 'declarations:read', description: 'Read declarations and their audit trails.' },
  { scope: 'declarations:write', description: 'Create and update draft declarations.' },
  { scope: 'declarations:submit', description: 'Submit declarations to the customs authority.' },
  { scope: 'tariff:read', description: 'Look up HS codes, rates, and FTA eligibility.' },
  { scope: 'bonded:read', description: 'Read bonded balances, movements, and exemptions.' },
  { scope: 'bonded:write', description: 'Record bonded movements and drawback claims.' },
  { scope: 'audit:read', description: 'Query and export the audit log.' },
];

const DEPRECATION_POLICY: readonly DeprecationRow[] = [
  {
    phase: 'Announcement',
    window: 'T+0',
    notes: 'Deprecation is announced in the changelog and by email to key owners.',
  },
  {
    phase: 'Dual support',
    window: '12 months',
    notes: 'Both old and new endpoints remain functional and monitored.',
  },
  {
    phase: 'Sunset warning',
    window: '90 days before',
    notes: 'A `Sunset` header is added to responses from the deprecated route.',
  },
  {
    phase: 'Removal',
    window: 'T+12 months',
    notes: 'The endpoint returns `410 Gone`. Migration guide remains published.',
  },
];

const SDKS: readonly Sdk[] = [
  {
    language: 'TypeScript / Node.js',
    package: '@tradeops/sdk',
    install: 'npm install @tradeops/sdk',
    repository: SDK_REPO_TS,
    accent: 'text-blue-600 dark:text-blue-400',
  },
  {
    language: 'Python',
    package: 'tradeops',
    install: 'pip install tradeops',
    repository: SDK_REPO_PY,
    accent: 'text-emerald-600 dark:text-emerald-500',
  },
  {
    language: 'Go',
    package: 'github.com/tradeops/tradeops-go',
    install: 'go get github.com/tradeops/tradeops-go',
    repository: SDK_REPO_GO,
    accent: 'text-cyan-600 dark:text-cyan-400',
  },
  {
    language: 'OpenAPI 3.1',
    package: 'openapi.json',
    install: 'Download specification',
    repository: `${API_BASE_URL}/openapi.json`,
    accent: 'text-violet-600 dark:text-violet-400',
  },
];

/* ============================================================================
 * ICONS — inline SVG, no external dependency
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
  Code: (p: IconProps) => (
    <SvgIcon {...p}>
      <path d="m16 18 6-6-6-6" />
      <path d="m8 6-6 6 6 6" />
    </SvgIcon>
  ),
  Key: (p: IconProps) => (
    <SvgIcon {...p}>
      <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777Zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </SvgIcon>
  ),
  Gauge: (p: IconProps) => (
    <SvgIcon {...p}>
      <path d="m12 14 4-4" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </SvgIcon>
  ),
  Webhook: (p: IconProps) => (
    <SvgIcon {...p}>
      <path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2" />
      <path d="m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06" />
      <path d="m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8" />
    </SvgIcon>
  ),
  Alert: (p: IconProps) => (
    <SvgIcon {...p}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </SvgIcon>
  ),
  Package: (p: IconProps) => (
    <SvgIcon {...p}>
      <path d="M16.5 9.4 7.55 4.24" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </SvgIcon>
  ),
  ArrowRight: (p: IconProps) => (
    <SvgIcon strokeWidth={2} {...p}>
      <path d="M4 10h12M11 5l5 5-5 5" />
    </SvgIcon>
  ),
  ExternalLink: (p: IconProps) => (
    <SvgIcon {...p}>
      <path d="M11 3h6v6M17 3l-9 9M8 5H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-4" />
    </SvgIcon>
  ),
  Book: (p: IconProps) => (
    <SvgIcon {...p}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </SvgIcon>
  ),
  Shield: (p: IconProps) => (
    <SvgIcon {...p}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </SvgIcon>
  ),
  Clock: (p: IconProps) => (
    <SvgIcon {...p}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </SvgIcon>
  ),
  LifeBuoy: (p: IconProps) => (
    <SvgIcon {...p}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="4.93" x2="9.17" y1="4.93" y2="9.17" />
      <line x1="14.83" x2="19.07" y1="14.83" y2="19.07" />
      <line x1="14.83" x2="19.07" y1="9.17" y2="4.93" />
      <line x1="4.93" x2="9.17" y1="19.07" y2="14.83" />
    </SvgIcon>
  ),
  Copy: (p: IconProps) => (
    <SvgIcon {...p}>
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </SvgIcon>
  ),
  Integration: (p: IconProps) => (
    <SvgIcon {...p}>
      <rect width="8" height="8" x="3" y="3" rx="1" />
      <rect width="8" height="8" x="13" y="13" rx="1" />
      <path d="M7 11v4a2 2 0 0 0 2 2h4" />
      <path d="m17 7-3 3" />
    </SvgIcon>
  ),
  Cargo: (p: IconProps) => (
    <SvgIcon {...p}>
      <path d="M5 7v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7" />
      <path d="M3 7h18" />
      <path d="M9 11h6" />
    </SvgIcon>
  ),
  Inventory: (p: IconProps) => (
    <SvgIcon {...p}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </SvgIcon>
  ),
  Declaration: (p: IconProps) => (
    <SvgIcon {...p}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h5" />
    </SvgIcon>
  ),
  Tariff: (p: IconProps) => (
    <SvgIcon {...p}>
      <path d="M3 7h18" />
      <path d="M3 12h18" />
      <path d="M3 17h18" />
      <circle cx="7" cy="7" r="1.5" />
      <circle cx="14" cy="12" r="1.5" />
      <circle cx="10" cy="17" r="1.5" />
    </SvgIcon>
  ),
  Bonded: (p: IconProps) => (
    <SvgIcon {...p}>
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </SvgIcon>
  ),
  Audit: (p: IconProps) => (
    <SvgIcon {...p}>
      <path d="M9 11H3v10h18V11h-6" />
      <path d="M9 11V3h6v8" />
      <path d="M12 3v8" />
    </SvgIcon>
  ),
};

function ResourceIcon({ name, className }: { name: ResourceGroup['icon']; className?: string }) {
  const map = {
    cargo: Icon.Cargo,
    inventory: Icon.Inventory,
    declaration: Icon.Declaration,
    tariff: Icon.Tariff,
    bonded: Icon.Bonded,
    audit: Icon.Audit,
  } as const;
  const Cmp = map[name];
  return <Cmp className={className} />;
}

/* ============================================================================
 * PRIMITIVES
 * ========================================================================= */

function CodeBlock({
  children,
  language,
  label,
}: {
  children: string;
  language?: string;
  label?: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border bg-muted/40">
      <div className="flex items-center justify-between border-b bg-muted/60 px-3 py-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          {label ?? language ?? 'code'}
        </span>
        {language && label && (
          <span className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
            {language}
          </span>
        )}
      </div>
      <pre className="overflow-x-auto p-4 text-xs leading-relaxed">
        <code className="font-mono">{children}</code>
      </pre>
    </div>
  );
}

function Table({
  children,
  caption,
}: {
  children: React.ReactNode;
  caption: string;
}) {
  return (
    <div className="-mx-4 overflow-x-auto sm:mx-0">
      <div className="inline-block min-w-full px-4 align-middle sm:px-0">
        <table className="min-w-full border-separate border-spacing-0 text-sm">
          <caption className="sr-only">{caption}</caption>
          {children}
        </table>
      </div>
    </div>
  );
}

function Th({
  children,
  scope = 'col',
  className = '',
}: {
  children: React.ReactNode;
  scope?: 'col' | 'row';
  className?: string;
}) {
  return (
    <th
      scope={scope}
      className={`border-b border-border/60 px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground ${className}`}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={`border-b border-border/40 px-3 py-3 align-top text-foreground/90 ${className}`}>
      {children}
    </td>
  );
}

function Callout({
  tone = 'info',
  icon,
  title,
  children,
}: {
  tone?: 'info' | 'warning';
  icon?: React.ReactNode;
  title?: string;
  children: React.ReactNode;
}) {
  const toneCls =
    tone === 'warning'
      ? 'border-amber-500/40 bg-amber-500/5'
      : 'border-border/60 bg-muted/30';
  return (
    <div className={`rounded-lg border p-4 ${toneCls}`}>
      <div className="flex items-start gap-3">
        {icon && <div className="mt-0.5 shrink-0 text-muted-foreground">{icon}</div>}
        <div className="min-w-0">
          {title && <p className="text-sm font-medium">{title}</p>}
          <div className={`text-sm text-muted-foreground ${title ? 'mt-1' : ''}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
}) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className="scroll-mt-24 border-t border-border/60 pt-12 first:border-t-0 first:pt-0">
      {eyebrow && (
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {eyebrow}
        </p>
      )}
      <h2 id={headingId} className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </h2>
      {description && (
        <div className="mt-3 max-w-3xl text-pretty text-muted-foreground">{description}</div>
      )}
      <div className="mt-8">{children}</div>
    </section>
  );
}

/* ============================================================================
 * SECTIONS
 * ========================================================================= */

function Sidebar() {
  return (
    <aside className="hidden lg:block">
      <nav aria-label="On this page" className="sticky top-24 space-y-0.5 text-sm">
        <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          On this page
        </p>
        {NAV_SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="block rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {s.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}

function TopBar() {
  return (
    <div className="border-b border-border/60 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <div className="flex items-center gap-3 text-sm">
          <Link
            href="/"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            TradeOps
          </Link>
          <span className="text-muted-foreground/50">/</span>
          <Link
            href="/api-docs"
            className="font-medium text-foreground"
            aria-current="page"
          >
            API docs
          </Link>
          <span className="hidden rounded-full border border-border/60 bg-muted/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline">
            {API_VERSION}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={STATUS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
            Operational
          </a>
          <Link
            href="/settings/api-keys"
            className="inline-flex items-center gap-1 rounded-md border border-border/60 px-2.5 py-1 text-xs font-medium transition-colors hover:bg-muted"
          >
            <Icon.Key className="h-3.5 w-3.5" />
            API keys
          </Link>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <header className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,theme(colors.slate.500/0.06),transparent)]"
      />
      <div className="mx-auto max-w-7xl px-4 pb-4 pt-12 lg:px-6 lg:pt-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
          API {API_VERSION} · OpenAPI 3.1
        </div>
        <h1 className="mt-6 max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Build on TradeOps.
        </h1>
        <p className="mt-5 max-w-2xl text-pretty text-lg text-muted-foreground">
          REST API for cargo, inventory, declarations, HS classification, and the
          bonded ledger. Typesafe SDKs, scoped keys, webhooks, and an OpenAPI
          specification. Everything the UI does, the API does.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/settings/api-keys"
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Get an API key
            <Icon.ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#quickstart"
            className="inline-flex items-center gap-2 rounded-lg border border-border/60 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Quick start
          </a>
          <a
            href="#resources"
            className="inline-flex items-center gap-2 rounded-lg border border-border/60 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            API surface
          </a>
        </div>
      </div>
    </header>
  );
}

function Overview() {
  const stats = [
    { label: 'Uptime SLA', value: UPTIME_SLA },
    { label: 'Resource groups', value: String(RESOURCE_GROUPS.length) },
    { label: 'Webhook events', value: String(WEBHOOK_EVENTS.length) },
    { label: 'Official SDKs', value: '3' },
  ];
  return (
    <Section
      id="overview"
      eyebrow="Overview"
      title="Everything the UI does, the API does."
      description="TradeOps exposes a REST API for the full operational and regulatory lifecycle. Read endpoints return typed JSON; write endpoints are idempotent and fully audited. The same primitives that power our product are available to your systems."
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border/60 bg-card p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {s.label}
            </p>
            <p className="mt-2 text-2xl font-semibold tabular-nums">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Callout icon={<Icon.Clock className="h-4 w-4" />} title="Stable versioning">
          Public APIs are versioned with a 12-month deprecation window.
          <Link
            href="#versioning"
            className="ml-1 underline underline-offset-4 hover:text-foreground"
          >
            Read the policy
          </Link>
          .
        </Callout>
        <Callout icon={<Icon.Shield className="h-4 w-4" />} title="Enterprise-grade security">
          Encrypted at rest and in transit, SOC 2 Type II, scoped keys, and
          per-tenant isolation.
          <Link
            href="/security"
            className="ml-1 underline underline-offset-4 hover:text-foreground"
          >
            Security overview
          </Link>
          .
        </Callout>
      </div>
    </Section>
  );
}

function QuickStart() {
  return (
    <Section
      id="quickstart"
      eyebrow="Quick start"
      title="Your first request in two minutes."
      description={
        <>
          Every request is authenticated with a bearer token. Create a key in the{' '}
          <Link
            href="/settings/api-keys"
            className="underline underline-offset-4 hover:text-foreground"
          >
            API keys page
          </Link>
          , then make your first call. OAuth clients can be managed from{' '}
          <Link
            href="/integration/auth/oauth-clients"
            className="underline underline-offset-4 hover:text-foreground"
          >
            integration settings
          </Link>
          .
        </>
      }
    >
      <ol className="space-y-8">
        <li>
          <div className="flex items-baseline gap-3">
            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background">
              1
            </span>
            <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Create an API key
            </h3>
          </div>
          <p className="ml-9 mt-3 text-sm text-muted-foreground">
            Keys are scoped. A key generated for read-only access cannot write,
            regardless of the endpoint. Create one for each environment (dev,
            staging, prod) and rotate independently.
          </p>
          <div className="ml-9 mt-3 flex flex-wrap gap-2">
            <Link
              href="/settings/api-keys"
              className="inline-flex items-center gap-1.5 rounded-md border border-border/60 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
            >
              <Icon.Key className="h-3.5 w-3.5" />
              Manage API keys
            </Link>
            <Link
              href="/integration/auth/secrets"
              className="inline-flex items-center gap-1.5 rounded-md border border-border/60 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
            >
              Secrets & rotation
            </Link>
            <Link
              href="/integration/auth/oauth-clients"
              className="inline-flex items-center gap-1.5 rounded-md border border-border/60 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
            >
              OAuth clients
            </Link>
          </div>
        </li>

        <li>
          <div className="flex items-baseline gap-3">
            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background">
              2
            </span>
            <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Set the environment variable
            </h3>
          </div>
          <div className="ml-9 mt-3">
            <CodeBlock language="bash" label="shell">
              {`export TRADEOPS_API_KEY="sk_live_your_key_here"`}
            </CodeBlock>
          </div>
        </li>

        <li>
          <div className="flex items-baseline gap-3">
            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background">
              3
            </span>
            <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Make a request
            </h3>
          </div>
          <div className="ml-9 mt-3">
            <CodeBlock language="bash" label="curl">
              {`curl ${API_BASE_URL}/cargo \\
  -H "Authorization: Bearer $TRADEOPS_API_KEY" \\
  -H "Accept: application/json"`}
            </CodeBlock>
          </div>
          <p className="ml-9 mt-3 text-xs text-muted-foreground">
            Responses are paginated. Use <code className="font-mono">?cursor=</code> for
            subsequent pages.
          </p>
        </li>

        <li>
          <div className="flex items-baseline gap-3">
            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background">
              4
            </span>
            <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Read the response
            </h3>
          </div>
          <div className="ml-9 mt-3">
            <CodeBlock language="json" label="200 OK">
              {`{
  "data": [
    {
      "id": "cns_01H8XYZ...",
      "status": "in_transit",
      "origin": { "port": "MYPKG", "country": "MY" },
      "destination": { "port": "NLRTM", "country": "NL" },
      "hs_code": "940330",
      "declared_value_myr": 120000,
      "created_at": "2026-10-10T09:14:22Z"
    }
  ],
  "pagination": {
    "next_cursor": "eyJpZCI6ImNuc18wMUg4WFlaLi4uIn0",
    "has_more": true
  }
}`}
            </CodeBlock>
          </div>
        </li>
      </ol>

      <div className="mt-8">
        <Callout icon={<Icon.Integration className="h-4 w-4" />} title="Integrating an existing system?">
          Pre-built connectors are available for EDI, ERP, TMS, WMS, and customs
          systems. See{' '}
          <Link
            href="/integration"
            className="underline underline-offset-4 hover:text-foreground"
          >
            Integration settings
          </Link>{' '}
          to configure them, or check{' '}
          <Link
            href="/integration/health"
            className="underline underline-offset-4 hover:text-foreground"
          >
            integration health
          </Link>{' '}
          for current connection status.
        </Callout>
      </div>
    </Section>
  );
}

function Authentication() {
  return (
    <Section
      id="authentication"
      eyebrow="Authentication"
      title="Scoped, tenant-bound bearer tokens."
      description="Every request is authenticated with a bearer token. Tokens are scoped and tenant-bound — a token issued for one tenant cannot access another tenant's data, regardless of the request."
    >
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-8">
          <div>
            <h3 className="text-sm font-medium">Bearer token</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Pass your API key in the <code className="font-mono">Authorization</code>{' '}
              header. Keys are prefixed with <code className="font-mono">sk_live_</code>{' '}
              (production) or <code className="font-mono">sk_test_</code> (sandbox).
            </p>
            <div className="mt-3">
              <CodeBlock language="http" label="request header">
                {`Authorization: Bearer sk_live_your_key_here`}
              </CodeBlock>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium">OAuth 2.0</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              For user-facing integrations where you act on behalf of a customer,
              use the OAuth 2.0 authorization code flow with PKCE. Clients are
              managed from integration settings.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href="/integration/auth/oauth-clients"
                className="inline-flex items-center gap-1.5 rounded-md border border-border/60 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
              >
                Manage OAuth clients
                <Icon.ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/settings/security"
                className="inline-flex items-center gap-1.5 rounded-md border border-border/60 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
              >
                Security settings
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium">Key rotation</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Create a second key, deploy it, then revoke the first. Keys are
              revoked immediately and cannot be restored. The dashboard shows the
              last usage timestamp per key so you can confirm a key is unused
              before revoking.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href="/settings/api-keys"
                className="inline-flex items-center gap-1.5 rounded-md border border-border/60 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
              >
                Rotate keys
              </Link>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium">Scopes</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Keys are scoped at creation. A key with only{' '}
            <code className="font-mono">cargo:read</code> cannot call a write
            endpoint, even if the endpoint would otherwise accept it.
          </p>
          <div className="mt-4">
            <Table caption="Available API scopes">
              <thead>
                <tr>
                  <Th>Scope</Th>
                  <Th>Description</Th>
                </tr>
              </thead>
              <tbody>
                {SCOPES.map((s) => (
                  <tr key={s.scope}>
                    <Td className="whitespace-nowrap font-mono text-xs">{s.scope}</Td>
                    <Td className="text-muted-foreground">{s.description}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Resources() {
  return (
    <Section
      id="resources"
      eyebrow="API surface"
      title="Six resource groups."
      description="Each group covers a distinct lifecycle stage. Every endpoint is documented with schema, examples, and error behaviour in the interactive reference."
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {RESOURCE_GROUPS.map((group) => (
          <article
            key={group.id}
            id={`resources-${group.id}`}
            className="group flex scroll-mt-24 flex-col rounded-xl border border-border/60 bg-card p-6 transition-shadow hover:shadow-md"
          >
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 bg-muted/30">
              <ResourceIcon name={group.icon} className={`h-5 w-5 ${group.accent}`} />
            </div>

            <h3 className="mt-4 text-base font-semibold">{group.name}</h3>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">{group.description}</p>

            <ul className="mt-4 space-y-1.5 border-t border-border/60 pt-4 font-mono text-xs">
              {group.endpoints.map((endpoint) => (
                <li key={endpoint} className="whitespace-pre text-muted-foreground">
                  {endpoint}
                </li>
              ))}
            </ul>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {group.scopes.map((scope) => (
                <span
                  key={scope}
                  className="rounded-full border border-border/60 bg-muted/40 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                >
                  {scope}
                </span>
              ))}
            </div>

            <div className="mt-4 border-t border-border/60 pt-4">
              <Link
                href={group.referenceHref}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Open in app
                <Icon.ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

function RateLimits() {
  return (
    <Section
      id="rate-limits"
      eyebrow="Rate limits"
      title="Predictable, per-key throttling."
      description={
        <>
          Limits are per API key, not per tenant. When you exceed a limit, the
          response is a <code className="font-mono">429</code> with a{' '}
          <code className="font-mono">Retry-After</code> header. Respect it —
          retrying before the header allows will extend the window.
        </>
      }
    >
      <Table caption="API rate limits by tier">
        <thead>
          <tr>
            <Th>Tier</Th>
            <Th>Sustained</Th>
            <Th>Burst</Th>
            <Th>Notes</Th>
          </tr>
        </thead>
        <tbody>
          {RATE_LIMITS.map((tier) => (
            <tr key={tier.tier}>
              <Td className="font-medium">{tier.tier}</Td>
              <Td className="tabular-nums">{tier.requests}</Td>
              <Td className="tabular-nums">{tier.burst}</Td>
              <Td className="text-muted-foreground">{tier.notes}</Td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="mt-8">
        <Callout icon={<Icon.Gauge className="h-4 w-4" />} title="Do you need higher limits?">
          Enterprise tiers support custom rates with committed throughput. Contact{' '}
          <Link
            href="/contact"
            className="underline underline-offset-4 hover:text-foreground"
          >
            sales
          </Link>{' '}
          to discuss your workload.
        </Callout>
      </div>
    </Section>
  );
}

function Idempotency() {
  return (
    <Section
      id="idempotency"
      eyebrow="Idempotency"
      title="Safe to retry, by construction."
      description="All POST and PATCH endpoints accept an Idempotency-Key header. Reusing a key with the same body returns the original response without re-executing. Reusing a key with a different body returns a 409."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <CodeBlock language="http" label="request">
            {`POST /cargo HTTP/1.1
Authorization: Bearer sk_live_...
Idempotency-Key: 4a1b2c3d-...
Content-Type: application/json

{ "origin": "MYPKG", "destination": "NLRTM" }`}
          </CodeBlock>
        </div>
        <div>
          <CodeBlock language="json" label="conflict — 409">
            {`{
  "error": {
    "code": "idempotency_conflict",
    "message": "This Idempotency-Key was used with a different body.",
    "request_id": "req_01H8XYZ..."
  }
}`}
          </CodeBlock>
        </div>
      </div>
      <div className="mt-6">
        <Callout icon={<Icon.Clock className="h-4 w-4" />}>
          Keys are retained for 24 hours. Use a fresh key for a different request;
          reuse only to retry an identical one.
        </Callout>
      </div>
    </Section>
  );
}

function Webhooks() {
  return (
    <Section
      id="webhooks"
      eyebrow="Webhooks"
      title="React to events, don't poll."
      description={
        <>
          Webhooks are delivered as <code className="font-mono">POST</code>{' '}
          requests to your endpoint, signed with an HMAC-SHA256 signature in the{' '}
          <code className="font-mono">X-TradeOps-Signature</code> header. Manage
          subscriptions and inspect deliveries from integration settings.
        </>
      }
    >
      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/integration/webhook/subscriptions"
          className="inline-flex items-center gap-1.5 rounded-md border border-border/60 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
        >
          <Icon.Webhook className="h-3.5 w-3.5" />
          Manage subscriptions
        </Link>
        <Link
          href="/integration/webhook/deliveries"
          className="inline-flex items-center gap-1.5 rounded-md border border-border/60 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
        >
          Delivery log
          <Icon.ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <Link
          href="/integration/health"
          className="inline-flex items-center gap-1.5 rounded-md border border-border/60 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
        >
          Endpoint health
        </Link>
      </div>

      <Table caption="Webhook event types">
        <thead>
          <tr>
            <Th>Event</Th>
            <Th>Description</Th>
            <Th>Payload</Th>
          </tr>
        </thead>
        <tbody>
          {WEBHOOK_EVENTS.map((event) => (
            <tr key={event.event}>
              <Td className="font-mono text-xs">{event.event}</Td>
              <Td className="text-muted-foreground">{event.description}</Td>
              <Td className="whitespace-nowrap text-xs text-muted-foreground">
                {event.payload}
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-medium">Signature verification</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Verify every webhook before trusting it. Compute the signature over
            the raw request body using your webhook secret. Do not parse the body
            before verifying.
          </p>
          <div className="mt-3">
            <CodeBlock language="typescript" label="verify.ts">
              {`import crypto from 'node:crypto';

function verifyWebhook(rawBody: string, signature: string, secret: string) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected),
  );
}`}
            </CodeBlock>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium">Retries</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            If your endpoint returns non-2xx or times out, we retry with
            exponential backoff for up to 72 hours. Respond within 10 seconds.
          </p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span aria-hidden className="text-muted-foreground/50">·</span>
              Respond with 200 within 10 seconds.
            </li>
            <li className="flex gap-2">
              <span aria-hidden className="text-muted-foreground/50">·</span>
              Deduplicate using <code className="font-mono">X-TradeOps-Delivery</code>.
            </li>
            <li className="flex gap-2">
              <span aria-hidden className="text-muted-foreground/50">·</span>
              Return 4xx for unrecoverable errors to stop retries early.
            </li>
          </ul>
          <div className="mt-4">
            <Link
              href="/integration/webhook/deliveries"
              className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-muted-foreground"
            >
              Inspect delivery log
              <Icon.ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Errors() {
  return (
    <Section
      id="errors"
      eyebrow="Errors"
      title="Stable codes, actionable messages."
      description={
        <>
          Every error response includes a stable{' '}
          <code className="font-mono">code</code>, a human-readable{' '}
          <code className="font-mono">message</code>, and a{' '}
          <code className="font-mono">request_id</code> for support. Branch on
          the code, not the message.
        </>
      }
    >
      <div className="mb-8">
        <CodeBlock language="json" label="403 Forbidden">
          {`{
  "error": {
    "code": "insufficient_scope",
    "message": "This key does not have the 'declarations:submit' scope.",
    "request_id": "req_01H8XYZABC..."
  }
}`}
        </CodeBlock>
      </div>

      <Table caption="API error codes">
        <thead>
          <tr>
            <Th>Code</Th>
            <Th>HTTP</Th>
            <Th>Meaning</Th>
            <Th>Recommended action</Th>
          </tr>
        </thead>
        <tbody>
          {ERROR_CODES.map((error) => (
            <tr key={error.code}>
              <Td className="whitespace-nowrap font-mono text-xs">{error.code}</Td>
              <Td className="tabular-nums">{error.http}</Td>
              <Td className="text-muted-foreground">{error.meaning}</Td>
              <Td className="text-muted-foreground">{error.action}</Td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="mt-6">
        <Callout icon={<Icon.LifeBuoy className="h-4 w-4" />} title="Need help with an error?">
          Contact{' '}
          <Link
            href="/contact"
            className="underline underline-offset-4 hover:text-foreground"
          >
            support
          </Link>{' '}
          with the <code className="font-mono">request_id</code> and we'll trace
          the request end-to-end.
        </Callout>
      </div>
    </Section>
  );
}

function Versioning() {
  return (
    <Section
      id="versioning"
      eyebrow="Versioning"
      title="A twelve-month deprecation window."
      description={
        <>
          The API is versioned in the URL path (<code className="font-mono">/v1</code>).
          Breaking changes ship in a new version. Additive changes ship in place.
          The current version is{' '}
          <strong className="text-foreground">{API_VERSION}</strong>.
        </>
      }
    >
      <Table caption="Deprecation lifecycle">
        <thead>
          <tr>
            <Th>Phase</Th>
            <Th>Window</Th>
            <Th>Notes</Th>
          </tr>
        </thead>
        <tbody>
          {DEPRECATION_POLICY.map((row) => (
            <tr key={row.phase}>
              <Td className="font-medium">{row.phase}</Td>
              <Td className="whitespace-nowrap tabular-nums">{row.window}</Td>
              <Td className="text-muted-foreground">{row.notes}</Td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Callout icon={<Icon.Book className="h-4 w-4" />} title="Changelog">
          Version history, breaking changes, and deprecation notices. Subscribe
          via RSS or webhook.
          <div className="mt-3">
            <Link
              href="/changelog"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
            >
              Read the changelog
              <Icon.ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Callout>
        <Callout icon={<Icon.Clock className="h-4 w-4" />} title="Sunset headers">
          Deprecated endpoints add a <code className="font-mono">Sunset</code>{' '}
          header with the removal date, so clients can self-detect.
        </Callout>
      </div>
    </Section>
  );
}

function Security() {
  return (
    <Section
      id="security"
      eyebrow="Security"
      title="Built for regulated workloads."
      description="TradeOps is designed for customs, bonded, and cross-border operations. Data is encrypted in transit and at rest; every state transition is audited; access is scoped and tenant-isolated."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <ul className="space-y-4">
          <li className="flex gap-3">
            <Icon.Shield className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Encryption everywhere</p>
              <p className="mt-1 text-sm text-muted-foreground">
                TLS 1.3 in transit, AES-256 at rest. Customer-managed keys
                available on Enterprise.
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <Icon.Shield className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">SOC 2 Type II</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Independent annual audit. Report available under NDA.
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <Icon.Shield className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Per-tenant isolation</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Keys are tenant-bound at the schema level. Cross-tenant access is
                impossible even with a valid key.
              </p>
            </div>
          </li>
        </ul>
        <ul className="space-y-4">
          <li className="flex gap-3">
            <Icon.Shield className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Full audit log</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Append-only record of every write. Query and export via the
                Audit resource or the UI.
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <Icon.Shield className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">IP allowlisting</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Restrict each key to a CIDR range from the security settings.
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <Icon.Shield className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Data residency</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Regional hosting for EU, APAC, and US on Enterprise plans.
              </p>
            </div>
          </li>
        </ul>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/security"
          className="inline-flex items-center gap-1.5 rounded-md border border-border/60 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
        >
          Security overview
          <Icon.ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <Link
          href="/legal/privacy"
          className="inline-flex items-center gap-1.5 rounded-md border border-border/60 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
        >
          Privacy policy
        </Link>
        <Link
          href="/legal/dpa"
          className="inline-flex items-center gap-1.5 rounded-md border border-border/60 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
        >
          Data processing agreement
        </Link>
      </div>
    </Section>
  );
}

function Sla() {
  return (
    <Section
      id="sla"
      eyebrow="SLA & support"
      title="Operational commitments you can plan around."
      description="Production tiers include a 99.95% monthly uptime SLA with service credits. Status, incidents, and scheduled maintenance are published on the status page."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border/60 bg-card p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Monthly uptime SLA
          </p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">{UPTIME_SLA}</p>
          <p className="mt-3 text-sm text-muted-foreground">
            Measured against the read API at the edge. Excludes scheduled
            maintenance announced at least 7 days in advance.
          </p>
          <div className="mt-4">
            <Link
              href="/legal/sla"
              className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-muted-foreground"
            >
              Full SLA
              <Icon.ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Support response
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex justify-between gap-4">
              <span className="text-muted-foreground">P1 · critical</span>
              <span className="tabular-nums">30 min</span>
            </li>
            <li className="flex justify-between gap-4">
              <span className="text-muted-foreground">P2 · high</span>
              <span className="tabular-nums">4 h</span>
            </li>
            <li className="flex justify-between gap-4">
              <span className="text-muted-foreground">P3 · normal</span>
              <span className="tabular-nums">1 business day</span>
            </li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 rounded-md border border-border/60 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
            >
              Contact support
            </Link>
            <a
              href={STATUS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-border/60 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
            >
              Status page
              <Icon.ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Sdks() {
  return (
    <Section
      id="sdks"
      eyebrow="SDKs"
      title="Official SDKs and specifications."
      description="Generated from the OpenAPI specification, so they stay in sync with the API. Each SDK includes typed models, retries, pagination helpers, and webhook signature verification."
    >
      <div className="grid gap-6 md:grid-cols-2">
        {SDKS.map((sdk) => (
          <article key={sdk.language} className="rounded-xl border border-border/60 bg-card p-6">
            <h3 className={`text-sm font-medium ${sdk.accent}`}>{sdk.language}</h3>
            <p className="mt-1 font-mono text-xs text-muted-foreground">{sdk.package}</p>

            <div className="mt-4">
              <CodeBlock language="bash" label="install">
                {sdk.install}
              </CodeBlock>
            </div>

            <div className="mt-4">
              <a
                href={sdk.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-muted-foreground"
              >
                Repository
                <Icon.ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

function SupportCTA() {
  return (
    <section className="border-t border-border/60 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          <article className="rounded-xl border border-border/60 bg-card p-6">
            <Icon.Integration className="h-5 w-5 text-muted-foreground" />
            <h3 className="mt-3 text-base font-semibold">Integration settings</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Configure EDI, ERP, TMS, WMS, and customs connections. Monitor
              health and replay failed deliveries.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/integration"
                className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-muted-foreground"
              >
                Configure
                <Icon.ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/integration/health"
                className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-muted-foreground"
              >
                Health
              </Link>
            </div>
          </article>

          <article className="rounded-xl border border-border/60 bg-card p-6">
            <Icon.Book className="h-5 w-5 text-muted-foreground" />
            <h3 className="mt-3 text-base font-semibold">Changelog</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Version history, breaking changes, and deprecation notices. Subscribe
              via RSS or webhook.
            </p>
            <div className="mt-4">
              <Link
                href="/changelog"
                className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-muted-foreground"
              >
                Read the changelog
                <Icon.ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </article>

          <article className="rounded-xl border border-border/60 bg-card p-6">
            <Icon.LifeBuoy className="h-5 w-5 text-muted-foreground" />
            <h3 className="mt-3 text-base font-semibold">Talk to engineering</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Architecture review, migration help, or custom throughput. Our team
              works directly with integration engineers.
            </p>
            <div className="mt-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-muted-foreground"
              >
                Contact us
                <Icon.ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </article>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-8 sm:flex-row sm:items-center">
          <p className="text-sm text-muted-foreground">
            Legal: <Link href="/legal/terms" className="underline underline-offset-4 hover:text-foreground">Terms</Link>{' · '}
            <Link href="/legal/privacy" className="underline underline-offset-4 hover:text-foreground">Privacy</Link>{' · '}
            <Link href="/legal/dpa" className="underline underline-offset-4 hover:text-foreground">DPA</Link>{' · '}
            <Link href="/legal/sla" className="underline underline-offset-4 hover:text-foreground">SLA</Link>
          </p>
          <Link
            href="/settings/api-keys"
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Get an API key
            <Icon.ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function StructuredData() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebAPI',
    name: 'TradeOps API',
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    documentation: PAGE_URL,
    provider: {
      '@type': 'Organization',
      name: 'TradeOps',
      url: SITE_URL,
    },
    termsOfService: `${SITE_URL}/legal/terms`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/* ============================================================================
 * PAGE
 * ========================================================================= */

export default function Page() {
  return (
    <main className="min-h-screen">
      <StructuredData />

      <a
        href="#overview"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-background"
      >
        Skip to content
      </a>

      <TopBar />
      <Hero />

      <div className="mx-auto max-w-7xl px-4 pb-24 pt-12 lg:px-6 lg:pt-16">
        <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
          <Sidebar />
          <div className="min-w-0 space-y-16">
            <Overview />
            <QuickStart />
            <Authentication />
            <Resources />
            <RateLimits />
            <Idempotency />
            <Webhooks />
            <Errors />
            <Versioning />
            <Security />
            <Sla />
            <Sdks />
          </div>
        </div>
      </div>

      <SupportCTA />
    </main>
  );
}