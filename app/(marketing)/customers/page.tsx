import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

/**
 * ============================================================================
 * CONTENT PLACEHOLDERS — REPLACE BEFORE PUBLISHING
 * ============================================================================
 *
 * This is a marketing page. Every customer name, logo, quote, metric, and
 * case study below is a placeholder. Before publishing:
 *
 *   1. Replace the CUSTOMERS list with real customer logos and names.
 *      Confirm in writing that each customer has consented to being named.
 *
 *   2. Replace the CASE_STUDIES with real engagements. Do not publish a
 *      case study without the customer's written approval of the specific
 *      numbers and quotes.
 *
 *   3. Replace the TESTIMONIALS with real quotes, attributed to real people
 *      who have approved the attribution. Do not invent a name or a title.
 *
 *   4. Replace the METRICS with numbers you can substantiate. A marketing
 *      page that overstates is a regulatory risk in some jurisdictions and
 *      a reputational risk everywhere.
 *
 *   5. Confirm any quoted improvement percentage is drawn from a real
 *      engagement and that the customer has approved its use.
 *
 * If you do not yet have customers willing to be named, ship the page with
 * the segments and testimonials sections omitted, and remove the logo grid.
 * An empty social-proof page is better than a fabricated one.
 * ============================================================================
 */

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

const BASE_URL = 'https://tradeops.example';
const PAGE_URL = `${BASE_URL}/customers`;
const PAGE_TITLE = 'Customers';
const PAGE_DESCRIPTION =
  'Free Zone operators, bonded warehouse managers, freight forwarders, and ' +
  'customs brokers use TradeOps to run duty-suspended operations with an ' +
  'audit trail and agent-assisted workflows.';

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

type Segment = {
  id: string;
  short: string;
  name: string;
  description: string;
  customerTypes: string[];
  outcome: string;
  accentClass: string;
};

type CaseStudy = {
  id: string;
  company: string;
  industry: string;
  zone: string;
  summary: string;
  metrics: { value: string; label: string }[];
  href: string;
};

type Testimonial = {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
};

type Metric = {
  value: string;
  label: string;
  context: string;
};

const SEGMENTS: readonly Segment[] = [
  {
    id: 'fiz',
    short: 'FIZ',
    name: 'Free Industrial Zone operators',
    description:
      'Manufacturers running bonded production where raw materials enter ' +
      'duty-free and finished goods leave under customs supervision. The ' +
      'operational problem is not warehousing — it is material traceability ' +
      'through production.',
    customerTypes: [
      'Electronics contract manufacturers',
      'Precision engineering firms',
      'Medical device assemblers',
      'Aerospace component suppliers',
    ],
    outcome:
      'Raw-material duty suspension with production-loss tracking and scrap control.',
    accentClass: 'from-blue-500/[0.08] to-transparent',
  },
  {
    id: 'fcz',
    short: 'FCZ',
    name: 'Free Commercial Zone operators',
    description:
      'Traders, distributors, and 3PLs running commercial-grade storage ' +
      'and light processing inside a customs perimeter. The problem is ' +
      'throughput with duty certainty, at the speed of modern trade.',
    customerTypes: [
      'Regional distribution centres',
      'Break-bulk and repacking operations',
      'Transhipment hubs',
      'E-commerce fulfilment operators',
    ],
    outcome:
      'High-throughput handling with duty visibility at every movement and a clearance-ready audit trail.',
    accentClass: 'from-emerald-500/[0.08] to-transparent',
  },
  {
    id: 'bonded',
    short: 'Bonded',
    name: 'Bonded warehouse operators',
    description:
      'Importers and logistics providers holding inventory under customs ' +
      'bond to defer duty until the moment of domestic sale. The problem ' +
      'is ledger integrity against a moving clearance timeline.',
    customerTypes: [
      'Consumer goods importers',
      'Pharmaceutical distributors',
      'Automotive parts distributors',
      'High-value electronics importers',
    ],
    outcome:
      'Duty and tax deferral with a bonded ledger that reconciles against customs in real time.',
    accentClass: 'from-amber-500/[0.08] to-transparent',
  },
];

const CASE_STUDIES: readonly CaseStudy[] = [
  {
    id: 'case-1',
    company: '[CUSTOMER NAME]',
    industry: 'Electronics manufacturing',
    zone: 'FIZ · Penang',
    summary:
      'Replaced a spreadsheet-based production-loss tracker with a bonded ledger that reconciles in real time. Raw-material duty suspension now flows through every production stage without a manual checkpoint.',
    metrics: [
      { value: '94%', label: 'reduction in reconciliation time' },
      { value: '100%', label: 'material traceability at batch level' },
      { value: '3 days', label: 'to a customs-audit-ready state' },
    ],
    href: '/customers/case-1',
  },
  {
    id: 'case-2',
    company: '[CUSTOMER NAME]',
    industry: 'Regional distribution',
    zone: 'FCZ · Port Klang',
    summary:
      'Consolidated three warehouse management systems into one zone-aware platform. Gate-in to gate-out now produces a single audit trail, and duty is resolved at the moment of clearance rather than at month-end.',
    metrics: [
      { value: '37%', label: 'increase in dock throughput' },
      { value: '2.1 days', label: 'average dwell time reduction' },
      { value: '0', label: 'reconciliation disputes in 18 months' },
    ],
    href: '/customers/case-2',
  },
  {
    id: 'case-3',
    company: '[CUSTOMER NAME]',
    industry: 'Pharmaceutical distribution',
    zone: 'Bonded · Johor',
    summary:
      'Brought bonded inventory under a single platform with automated exemption tracking. Duty deferral is now provable at the item level, and drawback recovery runs on a scheduled cycle instead of ad hoc.',
    metrics: [
      { value: 'RM 2.4M', label: 'annual duty deferral managed' },
      { value: '68%', label: 'drawback recovery uplift' },
      { value: '100%', label: 'audit trail on every movement' },
    ],
    href: '/customers/case-3',
  },
];

const TESTIMONIALS: readonly Testimonial[] = [
  {
    id: 't-1',
    quote:
      'We replaced three systems and a spreadsheet. The reconciliation that used to take my team four days now takes an afternoon. That is not a productivity gain — it is a completely different way of working.',
    author: '[FULL NAME]',
    role: 'Director of Operations',
    company: '[CUSTOMER NAME]',
  },
  {
    id: 't-2',
    quote:
      'The agent approval workflow was the deciding factor. Our compliance team will not let software file declarations autonomously, and TradeOps did not ask them to. The agent prepares, the human approves, the audit records it.',
    author: '[FULL NAME]',
    role: 'Head of Compliance',
    company: '[CUSTOMER NAME]',
  },
  {
    id: 't-3',
    quote:
      'We went from a two-day customs audit preparation to a click. The audit trail is the product, as far as I am concerned. Everything else is a bonus.',
    author: '[FULL NAME]',
    role: 'Customs Manager',
    company: '[CUSTOMER NAME]',
  },
];

const METRICS: readonly Metric[] = [
  {
    value: '4,300+',
    label: 'Tariff subheadings',
    context: 'Mapped to AHTN 2022 with sourced rates',
  },
  {
    value: '16',
    label: 'Free Trade Agreements',
    context: 'ATIGA, RCEP, CPTPP, and bilateral',
  },
  {
    value: '100%',
    label: 'Movements audited',
    context: 'Append-only, enforced at the database',
  },
  {
    value: '0',
    label: 'Silent agent actions',
    context: 'Every agent decision requires human approval or a scoped rule',
  },
];

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

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

function QuoteIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M6.5 5C4.01 5 2 7.01 2 9.5S4.01 14 6.5 14c.34 0 .67-.04 1-.1-.35 1.94-1.9 3.53-3.85 4.1a.75.75 0 0 0 .35 1.45c3.5-.83 6-3.94 6-7.7V9.5C10 7.01 7.99 5 6.5 5ZM17.5 5C15.01 5 13 7.01 13 9.5s2.01 4.5 4.5 4.5c.34 0 .67-.04 1-.1-.35 1.94-1.9 3.53-3.85 4.1a.75.75 0 0 0 .35 1.45c3.5-.83 6-3.94 6-7.7V9.5C21 7.01 18.99 5 17.5 5Z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Hero() {
  return (
    <header className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,theme(colors.emerald.500/0.06),transparent)]"
      />
      <div className="mx-auto max-w-7xl px-4 pb-14 pt-20 sm:pt-24">
        <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Customers in production
        </div>

        <h1 className="mt-6 max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Free Zone operators run on TradeOps.
        </h1>

        <p className="mt-5 max-w-2xl text-pretty text-lg text-muted-foreground">
          From electronics manufacturers in a FIZ to regional distributors in
          a FCZ to bonded importers holding inventory against a clearance
          timeline — teams use TradeOps to keep duty-suspended operations
          auditable, accurate, and fast.
        </p>
      </div>
    </header>
  );
}

function LogoRow() {
  // Placeholder logo row. Replace with real customer logos you have consent
  // to display. If you do not yet have consented logos, remove this section.
  const logos = ['[LOGO 1]', '[LOGO 2]', '[LOGO 3]', '[LOGO 4]', '[LOGO 5]'];

  return (
    <section
      aria-label="Trusted by"
      className="border-y bg-muted/20 print:hidden"
    >
      <div className="mx-auto max-w-7xl px-4 py-10">
        <p className="text-center text-xs uppercase tracking-wide text-muted-foreground">
          Trusted by operators across the region
        </p>
        <ul className="mt-6 grid grid-cols-2 items-center gap-6 sm:grid-cols-3 md:grid-cols-5">
          {logos.map((logo) => (
            <li
              key={logo}
              className="flex h-10 items-center justify-center rounded border border-dashed text-xs text-muted-foreground"
            >
              {logo}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Segments() {
  return (
    <section
      aria-labelledby="segments-heading"
      className="mx-auto max-w-7xl px-4 py-16"
    >
      <div className="max-w-2xl">
        <h2
          id="segments-heading"
          className="text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          Three zones, three different operations.
        </h2>
        <p className="mt-3 text-muted-foreground">
          A FIZ manufacturer, a FCZ distributor, and a bonded warehouse
          operator face different problems even when they share a customs
          perimeter. TradeOps models them separately because the operational
          reality is different.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {SEGMENTS.map((segment) => (
          <article
            key={segment.id}
            className="group relative flex flex-col overflow-hidden rounded-xl border bg-background p-6 transition-shadow hover:shadow-md"
          >
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b ${segment.accentClass}`}
            />

            <div className="relative">
              <span className="inline-flex items-center rounded-md border bg-background/70 px-2 py-0.5 text-xs font-medium backdrop-blur">
                {segment.short}
              </span>
            </div>

            <h3 className="relative mt-4 text-lg font-semibold">
              {segment.name}
            </h3>
            <p className="relative mt-3 text-sm text-muted-foreground">
              {segment.description}
            </p>

            <div className="relative mt-5">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Who operates here
              </p>
              <ul className="mt-2 space-y-1 text-sm">
                {segment.customerTypes.map((type) => (
                  <li key={type} className="flex items-start gap-2">
                    <span
                      aria-hidden="true"
                      className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-muted-foreground/60"
                    />
                    <span className="text-muted-foreground">{type}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative mt-auto pt-5">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                What TradeOps delivers
              </p>
              <p className="mt-1.5 text-sm text-foreground/90">
                {segment.outcome}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function CaseStudies() {
  return (
    <section
      aria-labelledby="case-studies-heading"
      className="border-y bg-muted/20"
    >
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2
              id="case-studies-heading"
              className="text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              What changes when the platform is customs-native.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Three engagements, three different zone types, one pattern:
              reconciliation stops being a monthly project and becomes a
              continuous state.
            </p>
          </div>
          <Link
            href="/customers"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            All case studies
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {CASE_STUDIES.map((study) => (
            <article
              key={study.id}
              className="group flex flex-col rounded-xl border bg-background p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium uppercase tracking-wide">
                  {study.industry}
                </span>
                <span>{study.zone}</span>
              </div>

              <h3 className="mt-3 text-base font-semibold">
                {study.company}
              </h3>

              <p className="mt-3 text-sm text-muted-foreground">
                {study.summary}
              </p>

              <dl className="mt-5 space-y-2.5 border-t pt-5">
                {study.metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="flex items-baseline justify-between gap-4"
                  >
                    <dt className="text-xs text-muted-foreground">
                      {metric.label}
                    </dt>
                    <dd className="text-sm font-semibold tabular-nums">
                      {metric.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-5 pt-4">
                <Link
                  href={study.href}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Read the case study
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

function Testimonials() {
  return (
    <section
      aria-labelledby="testimonials-heading"
      className="mx-auto max-w-7xl px-4 py-16"
    >
      <h2
        id="testimonials-heading"
        className="sr-only"
      >
        What customers say
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((testimonial) => (
          <figure
            key={testimonial.id}
            className="flex flex-col rounded-xl border bg-background p-6"
          >
            <QuoteIcon className="h-6 w-6 text-muted-foreground/40" />
            <blockquote className="mt-4 text-pretty text-sm leading-relaxed text-foreground/90">
              {testimonial.quote}
            </blockquote>
            <figcaption className="mt-6 border-t pt-4">
              <div className="text-sm font-medium">{testimonial.author}</div>
              <div className="text-xs text-muted-foreground">
                {testimonial.role} · {testimonial.company}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function Metrics() {
  return (
    <section
      aria-labelledby="metrics-heading"
      className="border-t bg-muted/30"
    >
      <div className="mx-auto max-w-7xl px-4 py-14">
        <h2 id="metrics-heading" className="sr-only">
          Platform at a glance
        </h2>

        <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {METRICS.map((metric) => (
            <div key={metric.label}>
              <dd className="text-3xl font-semibold tabular-nums tracking-tight">
                {metric.value}
              </dd>
              <dt className="mt-1 text-sm font-medium">{metric.label}</dt>
              <p className="mt-1 text-xs text-muted-foreground">
                {metric.context}
              </p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20">
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-muted/60 to-background px-6 py-14 text-center sm:px-12">
        <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
          Bring one shipment. We will walk the whole lifecycle.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-pretty text-muted-foreground">
          Tell us a commodity, an origin, and a destination. We will show you
          gate-in, storage, bonded ledger, declaration preparation, and
          gate-out on your own cargo — no generic demo data.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Start the walkthrough
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Talk to us
          </Link>
        </div>
      </div>
    </section>
  );
}

function StructuredData() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    isPartOf: { '@type': 'WebSite', url: BASE_URL, name: 'TradeOps' },
    about: SEGMENTS.map((segment) => ({
      '@type': 'Thing',
      name: segment.name,
      description: segment.description,
    })),
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
      <LogoRow />
      <Segments />
      <CaseStudies />
      <Testimonials />
      <Metrics />
      <FinalCTA />
    </main>
  );
}
