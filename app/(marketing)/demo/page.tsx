import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

const BASE_URL = 'https://kurnia-kadir.xyz';
const PAGE_URL = `${BASE_URL}/demo`;
const PAGE_TITLE = 'TradeOps for FIZ, FCZ & Bonded Zones';
const PAGE_DESCRIPTION =
  'Duty-suspension aware operations for Free Industrial Zones, Free ' +
  'Commercial Zones, and bonded warehouses. Agent-in-the-loop workflows, ' +
  'audit-ready records, and customs-native design.';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    'Free Industrial Zone',
    'Free Commercial Zone',
    'bonded warehouse',
    'duty suspension',
    'customs',
    'CFS',
    'FIZ',
    'FCZ',
    'TradeOps',
  ],
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

// Force static rendering — this is a marketing page with no dynamic data.
export const dynamic = 'force-static';

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

type Zone = {
  id: string;
  short: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  href: string;
  accentClass: string;
};

const ZONES: readonly Zone[] = [
  {
    id: 'fiz',
    short: 'FIZ',
    name: 'Free Industrial Zone',
    tagline: 'Manufacture without duty friction',
    description:
      'Bonded manufacturing where raw materials enter duty-free and ' +
      'finished goods leave under customs supervision. Built for ' +
      'production flows, not warehouse ones.',
    features: [
      'Raw-material duty suspension',
      'Production-loss tracking',
      'Scrap and by-product control',
      'Finished-goods declaration',
    ],
    href: '/demo/fiz',
    accentClass: 'from-blue-500/[0.07] to-transparent',
  },
  {
    id: 'fcz',
    short: 'FCZ',
    name: 'Free Commercial Zone',
    tagline: 'Trade, repack, and tranship at speed',
    description:
      'Commercial-grade storage and light processing inside a customs ' +
      'perimeter. Trading, break-bulk, relabelling, and regional ' +
      'distribution without duty becoming payable until the goods leave.',
    features: [
      'Break-bulk and repacking',
      'Relabelling and kitting',
      'Regional distribution',
      'Transhipment handling',
    ],
    href: '/demo/fcz',
    accentClass: 'from-emerald-500/[0.07] to-transparent',
  },
  {
    id: 'bonded',
    short: 'Bonded',
    name: 'Bonded Warehouse',
    tagline: 'Defer duty until the moment it is due',
    description:
      'Duty and tax suspended storage outside a Free Zone, under customs ' +
      'bond. Ideal for importers who need to hold inventory before ' +
      'committing to a domestic sale.',
    features: [
      'Duty and tax deferral',
      'Bonded ledger integrity',
      'Exemption and drawback tracking',
      'Domestic clearance on demand',
    ],
    href: '/demo/bonded',
    accentClass: 'from-amber-500/[0.07] to-transparent',
  },
] as const;

const VALUE_PROPS = [
  {
    title: 'Duty-suspension aware',
    body: 'Every movement, adjustment, and clearance resolves against the current tariff dataset with a sourced rate and an audit trail.',
  },
  {
    title: 'Agent-in-the-loop',
    body: 'AI agents prepare, suggest, and audit. Humans approve anything that files, moves bonded goods, or crosses a value threshold.',
  },
  {
    title: 'Audit-ready by design',
    body: 'Append-only records for every state change. Gate passes, seal numbers, weighbridge tickets, and approvals, all in one place.',
  },
] as const;

const STATS = [
  { value: '4,300+', label: 'Tariff subheadings covered' },
  { value: '16', label: 'Free Trade Agreements resolved' },
  { value: '100%', label: 'Movements with audit trail' },
  { value: '0', label: 'Silent agent actions' },
] as const;

// ---------------------------------------------------------------------------
// Icons — inline SVGs so this page has no icon dependency
// ---------------------------------------------------------------------------

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M4 10.5l4 4 8-8" />
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

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------

function Hero() {
  return (
    <header className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,theme(colors.blue.500/0.08),transparent)]"
      />
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 sm:pt-28">
        <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Live demo · no signup required
        </div>

        <h1 className="mt-6 max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Customs-native operations for FIZ, FCZ, and bonded warehouses.
        </h1>

        <p className="mt-5 max-w-2xl text-pretty text-lg text-muted-foreground">
          TradeOps runs the operational and regulatory lifecycle of cargo
          moving through a Free Zone or a bonded facility — from gate-in to
          declaration to gate-out — with the tariff, the controls, and the
          audit trail built in.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/workflow"
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Explore the workflow
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
          <Link
            href="/api-docs"
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Read the docs
          </Link>
        </div>
      </div>
    </header>
  );
}

function ValueProps() {
  return (
    <section aria-labelledby="value-props-heading" className="border-y bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <h2 id="value-props-heading" className="sr-only">
          Why TradeOps
        </h2>
        <dl className="grid gap-8 md:grid-cols-3">
          {VALUE_PROPS.map((prop) => (
            <div key={prop.title}>
              <dt className="flex items-center gap-2 text-sm font-medium">
                <CheckIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
                {prop.title}
              </dt>
              <dd className="mt-2 text-sm text-muted-foreground">{prop.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function ZoneCard({ zone }: { zone: Zone }) {
  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-xl border bg-background p-6 transition-shadow hover:shadow-md`}
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b ${zone.accentClass}`}
      />

      <div className="relative flex items-center justify-between">
        <span className="inline-flex items-center rounded-md border bg-background/70 px-2 py-0.5 text-xs font-medium backdrop-blur">
          {zone.short}
        </span>
      </div>

      <h3 className="relative mt-4 text-lg font-semibold">{zone.name}</h3>
      <p className="relative mt-1 text-sm font-medium text-muted-foreground">
        {zone.tagline}
      </p>
      <p className="relative mt-3 text-sm text-muted-foreground">
        {zone.description}
      </p>

      <ul className="relative mt-5 space-y-2 text-sm">
        {zone.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-500" />
            <span className="text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="relative mt-6 pt-4">
        <Link
          href={zone.href}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Explore {zone.short}
          <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}

function Zones() {
  return (
    <section aria-labelledby="zones-heading" className="mx-auto max-w-7xl px-4 py-16">
      <div className="max-w-2xl">
        <h2 id="zones-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Three zones, three sets of rules.
        </h2>
        <p className="mt-3 text-muted-foreground">
          Each zone type has its own customs treatment, its own documentation
          requirements, and its own operational cadence. TradeOps models them
          separately because they are not the same problem.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {ZONES.map((zone) => (
          <ZoneCard key={zone.id} zone={zone} />
        ))}
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section aria-labelledby="stats-heading" className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <h2 id="stats-heading" className="sr-only">
          Platform at a glance
        </h2>
        <dl className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                {stat.label}
              </dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight">
                {stat.value}
              </dd>
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
          See the whole lifecycle on your own cargo.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-pretty text-muted-foreground">
          Bring one shipment. We will walk it through gate-in, storage,
          bonded ledger, declaration preparation, and gate-out — using your
          commodity, your origin, and your destination.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/workflow"
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
    '@type': 'SoftwareApplication',
    name: 'TradeOps',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    featureList: ZONES.flatMap((z) => z.features),
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'MYR',
      description: 'Demo access',
    },
  };
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe for JSON-LD; the only user-controlled
      // input here is static constants defined in this file.
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
      <ValueProps />
      <Zones />
      <Stats />
      <FinalCTA />
    </main>
  );
}
