import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

/**
 * ============================================================================
 * API DOCUMENTATION LANDING PAGE
 * ============================================================================
 *
 * This is the landing page for developer documentation. It is NOT the full
 * API reference — that usually lives in a separate tool (Swagger UI, Redoc,
 * Mintlify, Docusaurus, or a custom reference site) linked from here.
 *
 * The landing page's job is to:
 *   1. Get a developer from "I have an API key" to "I made a successful
 *      request" in under five minutes.
 *   2. Show the shape of the API surface so they can find the right resource
 *      group without reading the entire reference.
 *   3. Answer the questions that come up before the first request: auth,
 *      rate limits, errors, SDKs, webhooks.
 *
 * Replace the following before publishing:
 *   - API_BASE_URL: your actual API endpoint
 *   - DOCS_URL: the URL of your full reference (Swagger, Redoc, etc.)
 *   - DASHBOARD_URL: where developers manage API keys
 *   - STATUS_URL: your status page
 *   - The code samples: they should match your actual API shape
 *   - The resource groups: they should match your actual API surface
 *
 * Note on path naming: the scaffold uses `/api-docs`. Common alternatives
 * are `/developers`, `/docs`, `/developer`, or `/api`. If you change the
 * path, update the metadata canonical URL below.
 * ============================================================================
 */

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

const BASE_URL = 'https://tradeops.example';
const API_BASE_URL = 'https://api.tradeops.example/v1';
const PAGE_URL = `${BASE_URL}/api-docs`;
const DOCS_URL = `${BASE_URL}/docs/api`;
const DASHBOARD_URL = `${BASE_URL}/dashboard/developers`;
const STATUS_URL = 'https://status.tradeops.example';
const PAGE_TITLE = 'API Documentation';
const PAGE_DESCRIPTION =
  'REST API for TradeOps. Programmatic access to cargo, inventory, ' +
  'declarations, HS classification, bonded ledger, and audit records. ' +
  'OpenAPI 3.1 specification. Official SDKs for TypeScript and Python.';

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

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

type ResourceGroup = {
  id: string;
  name: string;
  description: string;
  endpoints: string[];
  href: string;
  accent: string;
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
};

// ---------------------------------------------------------------------------
// Resource groups
// ---------------------------------------------------------------------------

const RESOURCE_GROUPS: readonly ResourceGroup[] = [
  {
    id: 'cargo',
    name: 'Cargo',
    description:
      'Consignments, shipments, containers, and package-level tracking. The primary resource for everything moving through a facility.',
    endpoints: [
      'GET /cargo',
      'GET /cargo/{id}',
      'POST /cargo',
      'PATCH /cargo/{id}',
      'GET /cargo/{id}/events',
    ],
    href: `${DOCS_URL}#cargo`,
    accent: 'text-blue-600 dark:text-blue-400',
  },
  {
    id: 'inventory',
    name: 'Inventory',
    description:
      'Stock levels, locations, lot and serial tracking, and stock movements. Regime-aware — bonded, duty-paid, transhipment, and drawback are separate stock pools.',
    endpoints: [
      'GET /inventory',
      'GET /inventory/{sku}',
      'POST /inventory/movements',
      'GET /inventory/regimes',
    ],
    href: `${DOCS_URL}#inventory`,
    accent: 'text-emerald-600 dark:text-emerald-500',
  },
  {
    id: 'declarations',
    name: 'Declarations',
    description:
      'Declaration preparation, submission tracking, and status. Submission to the customs authority is a separate, audited action.',
    endpoints: [
      'GET /declarations',
      'POST /declarations',
      'GET /declarations/{id}',
      'POST /declarations/{id}/submit',
      'GET /declarations/{id}/audit-trail',
    ],
    href: `${DOCS_URL}#declarations`,
    accent: 'text-violet-600 dark:text-violet-400',
  },
  {
    id: 'classification',
    name: 'HS Classification',
    description:
      'Tariff lookup, rate resolution, control-list checks, and FTA eligibility. Every rate carries a source and a retrieval date.',
    endpoints: [
      'GET /tariff/{code}',
      'POST /tariff/search',
      'POST /tariff/resolve-rate',
      'POST /tariff/calculate-tax',
    ],
    href: `${DOCS_URL}#tariff`,
    accent: 'text-amber-600 dark:text-amber-500',
  },
  {
    id: 'bonded',
    name: 'Bonded Ledger',
    description:
      'Bonded balance, movement records, exemption tracking, and drawback recovery. The append-only ledger of duty-suspended goods.',
    endpoints: [
      'GET /bonded/balance',
      'POST /bonded/movements',
      'GET /bonded/exemptions',
      'POST /bonded/drawback-claims',
    ],
    href: `${DOCS_URL}#bonded`,
    accent: 'text-rose-600 dark:text-rose-400',
  },
  {
    id: 'audit',
    name: 'Audit',
    description:
      'Append-only audit log of every state transition. Query by actor, resource, timestamp, or event type.',
    endpoints: [
      'GET /audit',
      'GET /audit/{id}',
      'GET /audit/export',
    ],
    href: `${DOCS_URL}#audit`,
    accent: 'text-slate-600 dark:text-slate-400',
  },
];

// ---------------------------------------------------------------------------
// Rate limits
// ---------------------------------------------------------------------------

const RATE_LIMITS: readonly RateLimitTier[] = [
  {
    tier: 'Development',
    requests: '60 per minute',
    burst: '120',
    notes: 'Free tier. Sandbox environment only.',
  },
  {
    tier: 'Standard',
    requests: '600 per minute',
    burst: '1,200',
    notes: 'Production tier. Default for paid plans.',
  },
  {
    tier: 'Enterprise',
    requests: 'Custom',
    burst: 'Custom',
    notes: 'Negotiated per contract. Contact sales for details.',
  },
  {
    tier: 'Webhooks (inbound)',
    requests: 'No limit',
    burst: '—',
    notes: 'Retry with exponential backoff for up to 72 hours.',
  },
];

// ---------------------------------------------------------------------------
// Webhook events
// ---------------------------------------------------------------------------

const WEBHOOK_EVENTS: readonly WebhookEvent[] = [
  {
    event: 'cargo.created',
    description: 'A new consignment or shipment has been registered.',
    payload: 'consignment object',
  },
  {
    event: 'cargo.status.changed',
    description: 'A cargo status transition occurred (received, in-transit, delivered, etc.).',
    payload: 'consignment object + previous status',
  },
  {
    event: 'inventory.movement',
    description: 'A stock movement was recorded, including regime transitions.',
    payload: 'movement object',
  },
  {
    event: 'declaration.prepared',
    description: 'A draft declaration has been prepared and is awaiting submission.',
    payload: 'declaration object',
  },
  {
    event: 'declaration.submitted',
    description: 'A declaration was submitted to the customs authority.',
    payload: 'declaration object + submission reference',
  },
  {
    event: 'declaration.query',
    description: 'The customs authority has raised a query on a declaration.',
    payload: 'query object',
  },
  {
    event: 'bonded.balance.threshold',
    description: 'A bonded balance crossed a configured threshold.',
    payload: 'balance alert object',
  },
  {
    event: 'audit.entry',
    description: 'An audited state transition occurred. Fires for every audit-worthy event.',
    payload: 'audit entry object',
  },
];

// ---------------------------------------------------------------------------
// Error codes
// ---------------------------------------------------------------------------

const ERROR_CODES: readonly ErrorCode[] = [
  {
    code: 'validation_error',
    http: '400',
    meaning: 'The request body or query parameters failed validation.',
    action: 'Check the `errors` array in the response for field-level detail.',
  },
  {
    code: 'authentication_failed',
    http: '401',
    meaning: 'The API key is missing, malformed, or revoked.',
    action: 'Verify the key in your dashboard. Rotate if compromised.',
  },
  {
    code: 'insufficient_scope',
    http: '403',
    meaning: 'The API key does not have the scope required for this endpoint.',
    action: 'Grant the required scope in the dashboard.',
  },
  {
    code: 'not_found',
    http: '404',
    meaning: 'The resource does not exist or is not visible to your tenant.',
    action: 'Verify the resource id and confirm you are using the correct tenant key.',
  },
  {
    code: 'rate_limit_exceeded',
    http: '429',
    meaning: 'Too many requests. The response includes a `Retry-After` header.',
    action: 'Back off per the `Retry-After` value. Do not retry immediately.',
  },
  {
    code: 'idempotency_conflict',
    http: '409',
    meaning: 'An Idempotency-Key was reused with a different request body.',
    action: 'Use a fresh key for a different request. Reuse only for retries of the same request.',
  },
  {
    code: 'upstream_unavailable',
    http: '503',
    meaning: 'A downstream dependency (customs system, LLM provider) is unavailable.',
    action: 'Retry with exponential backoff. The request is safe to retry.',
  },
  {
    code: 'internal_error',
    http: '500',
    meaning: 'An unexpected server error occurred.',
    action: 'Retry once. If it persists, contact support with the `request_id` from the response.',
  },
];

// ---------------------------------------------------------------------------
// SDKs
// ---------------------------------------------------------------------------

const SDKS: readonly Sdk[] = [
  {
    language: 'TypeScript / Node.js',
    package: '@tradeops/sdk',
    install: 'npm install @tradeops/sdk',
    repository: 'https://github.com/tradeops/tradeops-typescript',
  },
  {
    language: 'Python',
    package: 'tradeops',
    install: 'pip install tradeops',
    repository: 'https://github.com/tradeops/tradeops-python',
  },
  {
    language: 'Go',
    package: 'github.com/tradeops/tradeops-go',
    install: 'go get github.com/tradeops/tradeops-go',
    repository: 'https://github.com/tradeops/tradeops-go',
  },
  {
    language: 'OpenAPI 3.1',
    package: 'openapi.json',
    install: 'Download specification',
    repository: `${API_BASE_URL}/openapi.json`,
  },
];

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function CodeIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m16 18 6-6-6-6" />
      <path d="m8 6-6 6 6 6" />
    </svg>
  );
}

function KeyIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777Zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  );
}

function GaugeIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m12 14 4-4" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </svg>
  );
}

function WebhookIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2" />
      <path d="m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06" />
      <path d="m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8" />
    </svg>
  );
}

function AlertIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  );
}

function PackageIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M16.5 9.4 7.55 4.24" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  );
}

function ExternalLinkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M11 3h6v6M17 3l-9 9M8 5H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-4" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Table primitives — consistent with other pages in this set
// ---------------------------------------------------------------------------

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
    <td
      className={`border-b border-border/40 px-3 py-3 align-top text-foreground/90 ${className}`}
    >
      {children}
    </td>
  );
}

// ---------------------------------------------------------------------------
// Code block
// ---------------------------------------------------------------------------

function CodeBlock({
  children,
  language,
}: {
  children: string;
  language?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-lg border bg-muted/40">
      {language && (
        <div className="border-b bg-muted/60 px-3 py-1.5 text-xs font-medium text-muted-foreground">
          {language}
        </div>
      )}
      <pre className="overflow-x-auto p-4 text-xs leading-relaxed">
        <code className="font-mono">{children}</code>
      </pre>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Hero() {
  return (
    <header className="relative overflow-hidden border-b">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,theme(colors.slate.500/0.06),transparent)]"
      />
      <div className="mx-auto max-w-7xl px-4 pb-14 pt-20 sm:pt-24">
        <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          API v1 · OpenAPI 3.1
        </div>

        <h1 className="mt-6 max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Build on TradeOps.
        </h1>

        <p className="mt-5 max-w-2xl text-pretty text-lg text-muted-foreground">
          REST API for cargo, inventory, declarations, HS classification, and
          the bonded ledger. Typesafe SDKs, webhooks, and an OpenAPI
          specification. Everything the UI does, the API does.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href={DOCS_URL}
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            API reference
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
          <Link
            href={DASHBOARD_URL}
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Get an API key
          </Link>
        </div>
      </div>
    </header>
  );
}

function QuickStart() {
  return (
    <section
      aria-labelledby="quickstart-heading"
      className="mx-auto max-w-7xl px-4 py-16"
    >
      <div className="max-w-2xl">
        <h2
          id="quickstart-heading"
          className="text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          Your first request in two minutes.
        </h2>
        <p className="mt-3 text-muted-foreground">
          Every request is authenticated with a bearer token. Create a key in
          the{' '}
          <Link
            href={DASHBOARD_URL}
            className="underline underline-offset-4 hover:text-foreground"
          >
            developer dashboard
          </Link>
          , then make your first call.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            1. Set your API key
          </h3>
          <div className="mt-3">
            <CodeBlock language="bash">{`export TRADEOPS_API_KEY="sk_live_your_key_here"`}</CodeBlock>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Keys are scoped. A key generated for read-only access cannot write,
            regardless of the endpoint.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            2. Make a request
          </h3>
          <div className="mt-3">
            <CodeBlock language="bash">{`curl ${API_BASE_URL}/cargo \\
  -H "Authorization: Bearer $TRADEOPS_API_KEY" \\
  -H "Accept: application/json"`}</CodeBlock>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            The response is paginated. Use <code>?cursor=</code> for subsequent
            pages. See the reference for the pagination envelope.
          </p>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            3. Read the response
          </h3>
          <div className="mt-3">
            <CodeBlock language="json">{`{
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
}`}</CodeBlock>
          </div>
        </div>
      </div>
    </section>
  );
}

function ResourceGroups() {
  return (
    <section
      aria-labelledby="resources-heading"
      className="border-y bg-muted/20"
    >
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="max-w-2xl">
          <h2
            id="resources-heading"
            className="text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            The API surface.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Six resource groups covering the operational and regulatory
            lifecycle. Each is documented in full in the reference.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {RESOURCE_GROUPS.map((group) => (
            <article
              key={group.id}
              className="group flex flex-col rounded-xl border bg-background p-6 transition-shadow hover:shadow-md"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border bg-muted/30">
                <CodeIcon className={`h-5 w-5 ${group.accent}`} />
              </div>

              <h3 className="mt-4 text-base font-semibold">{group.name}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">
                {group.description}
              </p>

              <ul className="mt-4 space-y-1 border-t pt-4 font-mono text-xs">
                {group.endpoints.map((endpoint) => (
                  <li key={endpoint} className="text-muted-foreground">
                    {endpoint}
                  </li>
                ))}
              </ul>

              <div className="mt-4">
                <Link
                  href={group.href}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  View reference
                  <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Authentication() {
  return (
    <section
      aria-labelledby="auth-heading"
      className="mx-auto max-w-7xl px-4 py-16"
    >
      <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
        <div>
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border bg-muted/30">
            <KeyIcon className="h-5 w-5" />
          </div>
          <h2
            id="auth-heading"
            className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            Authentication
          </h2>
          <p className="mt-3 text-muted-foreground">
            Every request is authenticated with a bearer token. Tokens are
            scoped and tenant-bound; a token issued for one tenant cannot
            access another tenant's data regardless of the request.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium">Bearer token</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Pass your API key in the <code>Authorization</code> header.
            </p>
            <div className="mt-3">
              <CodeBlock language="http">{`Authorization: Bearer sk_live_your_key_here`}</CodeBlock>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium">Scopes</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Keys are scoped at creation. A key with only{' '}
              <code>cargo:read</code> cannot call a write endpoint, even if the
              endpoint would otherwise accept it.
            </p>
            <ul className="mt-3 space-y-1 font-mono text-xs text-muted-foreground">
              <li>cargo:read · cargo:write</li>
              <li>inventory:read · inventory:write</li>
              <li>declarations:read · declarations:write · declarations:submit</li>
              <li>tariff:read</li>
              <li>bonded:read · bonded:write</li>
              <li>audit:read</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium">Key rotation</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Create a second key, deploy it, then revoke the first. Keys are
              revoked immediately and cannot be restored. The dashboard shows
              the last usage timestamp per key so you can confirm a key is
              unused before revoking.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function RateLimits() {
  return (
    <section
      aria-labelledby="rate-heading"
      className="border-y bg-muted/20"
    >
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex items-start gap-3">
          <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-background">
            <GaugeIcon className="h-5 w-5" />
          </div>
          <div>
            <h2
              id="rate-heading"
              className="text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              Rate limits
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Limits are per API key, not per tenant. When you exceed a limit,
              the response is a <code>429</code> with a <code>Retry-After</code>{' '}
              header. Respect it — retrying before the header allows will
              extend the window.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <Table caption="API rate limits by tier">
            <thead>
              <tr>
                <Th>Tier</Th>
                <Th>Sustained rate</Th>
                <Th>Burst allowance</Th>
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
        </div>

        <div className="mt-8 rounded-lg border bg-background p-4">
          <p className="text-sm">
            <strong className="font-medium">Idempotency.</strong> All{' '}
            <code>POST</code> and <code>PATCH</code> endpoints accept an{' '}
            <code>Idempotency-Key</code> header. Reusing a key with the same
            body returns the original response without re-executing the
            request. Reusing a key with a different body returns a{' '}
            <code>409 idempotency_conflict</code>.
          </p>
        </div>
      </div>
    </section>
  );
}

function Webhooks() {
  return (
    <section
      aria-labelledby="webhooks-heading"
      className="mx-auto max-w-7xl px-4 py-16"
    >
      <div className="flex items-start gap-3">
        <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-muted/30">
          <WebhookIcon className="h-5 w-5" />
        </div>
        <div>
          <h2
            id="webhooks-heading"
            className="text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            Webhooks
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Subscribe to events instead of polling. Webhooks are delivered as{' '}
            <code>POST</code> requests to your configured endpoint, signed with
            an HMAC-SHA256 signature in the{' '}
            <code>X-TradeOps-Signature</code> header.
          </p>
        </div>
      </div>

      <div className="mt-10">
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
                <Td className="text-xs text-muted-foreground">
                  {event.payload}
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-medium">Signature verification</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Verify every webhook before trusting it. The signature is computed
            over the raw request body with your webhook secret. Do not parse
            the body before verifying.
          </p>
          <div className="mt-3">
            <CodeBlock language="typescript">{`import crypto from 'node:crypto';

function verifyWebhook(rawBody: string, signature: string, secret: string) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected),
  );
}`}</CodeBlock>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium">Retries</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            If your endpoint returns a non-2xx response or times out, we retry
            with exponential backoff for up to 72 hours. Your endpoint must
            respond within 10 seconds. Idempotency is your responsibility —
            the same event may be delivered more than once.
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
            <li>· Respond with 200 within 10 seconds</li>
            <li>· Deduplicate using the <code>X-TradeOps-Delivery</code> header</li>
            <li>· Return 4xx for unrecoverable errors to stop retries early</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function Errors() {
  return (
    <section
      aria-labelledby="errors-heading"
      className="border-y bg-muted/20"
    >
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex items-start gap-3">
          <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-background">
            <AlertIcon className="h-5 w-5" />
          </div>
          <div>
            <h2
              id="errors-heading"
              className="text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              Errors
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Every error response includes a stable <code>code</code>, a
              human-readable <code>message</code>, and a{' '}
              <code>request_id</code> for support. Branch on the code, not the
              message — messages may be reworded.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <CodeBlock language="json">{`{
  "error": {
    "code": "insufficient_scope",
    "message": "This key does not have the 'declarations:submit' scope.",
    "request_id": "req_01H8XYZABC..."
  }
}`}</CodeBlock>
        </div>

        <div className="mt-8">
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
                  <Td className="font-mono text-xs">{error.code}</Td>
                  <Td className="tabular-nums">{error.http}</Td>
                  <Td className="text-muted-foreground">{error.meaning}</Td>
                  <Td className="text-muted-foreground">{error.action}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </section>
  );
}

function Sdks() {
  return (
    <section
      aria-labelledby="sdks-heading"
      className="mx-auto max-w-7xl px-4 py-16"
    >
      <div className="flex items-start gap-3">
        <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-muted/30">
          <PackageIcon className="h-5 w-5" />
        </div>
        <div>
          <h2
            id="sdks-heading"
            className="text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            SDKs and specifications
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Official SDKs for the languages our customers actually use.
            Generated from the OpenAPI specification, so they stay in sync with
            the API.
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {SDKS.map((sdk) => (
          <article
            key={sdk.language}
            className="rounded-xl border bg-background p-6"
          >
            <h3 className="text-sm font-medium">{sdk.language}</h3>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {sdk.package}
            </p>

            <div className="mt-4">
              <CodeBlock language="bash">{sdk.install}</CodeBlock>
            </div>

            <div className="mt-4">
              <a
                href={sdk.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Repository
                <ExternalLinkIcon className="h-3.5 w-3.5" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function SupportCTA() {
  return (
    <section className="border-t bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          <article className="rounded-xl border bg-background p-6">
            <h3 className="text-base font-semibold">Full reference</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Every endpoint, every field, every response shape. Interactive
              request builder with your API key.
            </p>
            <Link
              href={DOCS_URL}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Open the reference
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </article>

          <article className="rounded-xl border bg-background p-6">
            <h3 className="text-base font-semibold">Changelog</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              API version history, breaking changes, and deprecation notices.
              Subscribe via RSS or webhook.
            </p>
            <Link
              href={`${BASE_URL}/changelog`}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Read the changelog
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </article>

          <article className="rounded-xl border bg-background p-6">
            <h3 className="text-base font-semibold">Status</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              API uptime, incident history, and scheduled maintenance.
              Subscribe for email or SMS alerts.
            </p>
            <a
              href={STATUS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              View status
              <ExternalLinkIcon className="h-3.5 w-3.5" />
            </a>
          </article>
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
    documentation: DOCS_URL,
    provider: {
      '@type': 'Organization',
      name: 'TradeOps',
      url: BASE_URL,
    },
    termsOfService: `${BASE_URL}/legal/terms`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function Page() {
  return (
    <main className="min-h-screen">
      <StructuredData />
      <Hero />
      <QuickStart />
      <ResourceGroups />
      <Authentication />
      <RateLimits />
      <Webhooks />
      <Errors />
      <Sdks />
      <SupportCTA />
    </main>
  );
}