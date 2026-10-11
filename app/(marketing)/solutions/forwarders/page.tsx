import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

/**
 * ============================================================================
 * CONTENT PLACEHOLDERS — REPLACE BEFORE PUBLISHING
 * ============================================================================
 *
 * Every customer name, metric, and quote below is a placeholder. Before
 * publishing:
 *
 *   1. Replace the TESTIMONIAL with a real quote from a forwarder who has
 *      approved the attribution. Do not invent a name or a title.
 *
 *   2. Replace the OUTCOMES metrics with numbers drawn from a real
 *      deployment. Do not publish a metric you cannot substantiate on
 *      request.
 *
 *   3. Replace the INTEGRATIONS with the carriers, customs systems, and
 *      CFS partners you actually support. Do not list an integration you
 *      do not have.
 *
 *   4. Confirm any quoted improvement percentage is drawn from a real
 *      engagement and the customer has approved its use.
 *
 * If you have no forwarders as customers yet, remove the testimonial and
 * outcomes sections and ship the page with the capabilities and workflow
 * sections only. An honest empty page is better than a fabricated one.
 * ============================================================================
 */

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

const BASE_URL = 'https://tradeops.example';
const PAGE_URL = `${BASE_URL}/solutions/forwarders`;
const PAGE_TITLE = 'TradeOps for Freight Forwarders';
const PAGE_DESCRIPTION =
  'Multi-client visibility, LCL consolidation, customs documentation at ' +
  'scale, and carrier coordination — for freight forwarders running cargo ' +
  'through Container Freight Stations, Free Zones, and bonded facilities.';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    'freight forwarder software',
    'freight forwarding platform',
    'LCL consolidation',
    'customs documentation',
    'CFS operations',
    'free zone forwarder',
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

export const dynamic = 'force-static';

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

type PainPoint = {
  id: string;
  problem: string;
  reality: string;
  cost: string;
};

type Capability = {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
};

type WorkflowStep = {
  number: string;
  title: string;
  description: string;
  outcome: string;
};

type Outcome = {
  value: string;
  label: string;
  context: string;
};

type Integration = {
  category: string;
  systems: string[];
  note: string;
};

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function EyeIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function LayersIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m12 2 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 17 9 5 9-5" />
    </svg>
  );
}

function FileCheckIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="m9 15 2 2 4-4" />
    </svg>
  );
}

function TruckIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M14 18V6a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h1" />
      <path d="M14 9h5l3 4v4a1 1 0 0 1-1 1h-1" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  );
}

function ShieldCheckIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function PlugIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M12 22v-5" />
      <path d="M9 8V2" />
      <path d="M15 8V2" />
      <path d="M18 8v3a6 6 0 0 1-12 0V8Z" />
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

function QuoteIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M6.5 5C4.01 5 2 7.01 2 9.5S4.01 14 6.5 14c.34 0 .67-.04 1-.1-.35 1.94-1.9 3.53-3.85 4.1a.75.75 0 0 0 .35 1.45c3.5-.83 6-3.94 6-7.7V9.5C10 7.01 7.99 5 6.5 5ZM17.5 5C15.01 5 13 7.01 13 9.5s2.01 4.5 4.5 4.5c.34 0 .67-.04 1-.1-.35 1.94-1.9 3.53-3.85 4.1a.75.75 0 0 0 .35 1.45c3.5-.83 6-3.94 6-7.7V9.5C21 7.01 18.99 5 17.5 5Z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Pain points — what forwarders actually struggle with
// ---------------------------------------------------------------------------

const PAIN_POINTS: readonly PainPoint[] = [
  {
    id: 'visibility',
    problem: 'You cannot see across all your clients and shipments at once.',
    reality:
      'A forwarder runs cargo for dozens of shippers, across multiple carriers, through several CFS and Free Zone facilities. Each carrier has its own portal, each CFS has its own system, and the picture only assembles in a spreadsheet.',
    cost:
      'The result is reactive work: delays discovered by the customer, not by you.',
  },
  {
    id: 'lcl',
    problem: 'LCL consolidation is where the damage, delay, and disputes live.',
    reality:
      'Multiple handling points, mixed cargo, shared containers. Damage discovered at destination, but no receiving inspection record to prove it did not happen at origin. Cargo compatibility problems that only surface at de-stuffing.',
    cost:
      'Claims that you cannot defend, and customers who blame the forwarder regardless of where the damage actually occurred.',
  },
  {
    id: 'documentation',
    problem: 'Documentation errors cause customs holds and demurrage charges.',
    reality:
      'Every shipment has a bill of lading, an invoice, a packing list, a certificate of origin, and often a permit. Each has its own field requirements. A single misclassified HS code or missing consignee detail stops the container at the port.',
    cost:
      'Demurrage, detention, and storage charges that eat the margin on the entire booking.',
  },
  {
    id: 'client-billing',
    problem: 'Client billing is a manual reconstruction at month-end.',
    reality:
      'Charges accrue across the shipment lifecycle — CFS handling, haulage, terminal, carrier freight, customs brokerage, storage. Reconstructing what to bill each client, with the evidence to back it up, is a full-time job nobody wants.',
    cost:
      'Revenue leakage on charges that were not captured, and disputes on charges the client cannot verify.',
  },
];

// ---------------------------------------------------------------------------
// Capabilities — how TradeOps addresses each
// ---------------------------------------------------------------------------

const CAPABILITIES: readonly Capability[] = [
  {
    id: 'multi-client',
    title: 'Multi-client visibility',
    description:
      'One console for every client, every shipment, every carrier. Your operations team sees the entire book without switching between portals or rebuilding spreadsheets.',
    features: [
      'Per-client dashboards with isolated data',
      'Cross-client shipment tracking',
      'Exception queue routed by client and priority',
      'Client-specific KPIs and reporting',
    ],
    icon: <EyeIcon className="h-5 w-5" />,
  },
  {
    id: 'lcl',
    title: 'LCL consolidation control',
    description:
      'Structured receiving inspections at origin and destination, with photographic evidence at both ends. Cargo compatibility rules enforced at the point of consolidation, not discovered at de-stuffing.',
    features: [
      'Receiving inspection records with photos',
      'Cargo compatibility and segregation rules',
      'Consolidation stowage planning',
      'Damage-at-receipt evidence shared with the shipper',
    ],
    icon: <LayersIcon className="h-5 w-5" />,
  },
  {
    id: 'documentation',
    title: 'Documentation at scale',
    description:
      'Bill of lading validation, packing list verification, HS code suggestion with sourced rates, and a missing-document checklist that runs before the booking is confirmed.',
    features: [
      'BOL field validation with source citations',
      'HS classification with agent-assisted suggestions',
      'Missing-document detection by destination country',
      'Documentation templates per trade lane',
    ],
    icon: <FileCheckIcon className="h-5 w-5" />,
  },
  {
    id: 'carrier',
    title: 'Carrier coordination',
    description:
      'Rate comparison, sailing schedules, cutoff monitoring, and demurrage exposure projection. The forwarder sees the true landed cost of each option before committing the client.',
    features: [
      'Multi-carrier rate comparison with surcharge breakdown',
      'Cutoff and schedule monitoring with alerts',
      'Demurrage and detention exposure projection',
      'Carrier performance tracking by lane',
    ],
    icon: <TruckIcon className="h-5 w-5" />,
  },
  {
    id: 'customs',
    title: 'Customs exposure management',
    description:
      'Every shipment checked against the current tariff dataset, with controlled-goods flags, preferential-rate eligibility, and an audit trail that stands up to a customs review.',
    features: [
      'MFN and FTA rate resolution',
      'Controlled-goods and import-quota flagging',
      'Agent-prepared declarations with human approval',
      'Append-only audit trail on every movement',
    ],
    icon: <ShieldCheckIcon className="h-5 w-5" />,
  },
  {
    id: 'integration',
    title: 'Integration with your stack',
    description:
      'Connect your ERP, your carrier accounts, the CFS systems at your terminals, and your customs broker. TradeOps is the orchestration layer, not another silo.',
    features: [
      'REST and webhook APIs',
      'EDI for legacy trading partners',
      'Carrier API connectors',
      'Customs declaration system integration',
    ],
    icon: <PlugIcon className="h-5 w-5" />,
  },
];

// ---------------------------------------------------------------------------
// Workflow — the forwarder's day, end to end
// ---------------------------------------------------------------------------

const WORKFLOW: readonly WorkflowStep[] = [
  {
    number: '01',
    title: 'Booking intake',
    description:
      'The client sends a booking by email, EDI, or through the portal. TradeOps validates the shipment against the tariff dataset, checks for controlled goods, and identifies any missing documentation before the booking is confirmed.',
    outcome:
      'Malformed bookings rejected in seconds, not discovered at the port.',
  },
  {
    number: '02',
    title: 'Carrier selection',
    description:
      'Rate comparison across your contracted carriers, with the full surcharge breakdown. Cutoff times, sailing schedules, and demurrage exposure shown side by side. The forwarder commits the client with the true landed cost.',
    outcome:
      'Margin preserved because the surcharges were visible from the start.',
  },
  {
    number: '03',
    title: 'Consolidation and CFS',
    description:
      'Cargo arrives at the CFS. Receiving inspection records weight, dimensions, condition, and photographs. Stowage planning enforces compatibility rules. The consolidated container is sealed, and the seal number is recorded against every shipment in it.',
    outcome:
      'Evidence trail that protects you against claims at destination.',
  },
  {
    number: '04',
    title: 'Documentation',
    description:
      'Bill of lading, packing list, invoice, and certificates assembled per trade lane. HS codes validated against the current tariff. The pre-submission checklist catches missing fields and inconsistent data.',
    outcome:
      'Customs holds avoided because the documentation was complete at origin.',
  },
  {
    number: '05',
    title: 'Carriage and tracking',
    description:
      'Container tracking with milestone alerts, cut-off monitoring, and exception routing. Delays flagged to the operations team before the client notices.',
    outcome:
      'Proactive communication, which is the difference between a client who stays and a client who leaves.',
  },
  {
    number: '06',
    title: 'Deconsolidation and clearance',
    description:
      'Destination CFS receives the container. Deconsolidation with inspection records. Customs clearance prepared, with duty and tax calculation against the tariff dataset. Controlled goods flagged for the appropriate broker review.',
    outcome:
      'Smooth clearance and a defence file if the cargo is short or damaged.',
  },
  {
    number: '07',
    title: 'Delivery and billing',
    description:
      'Final delivery to the consignee. Charges captured at every stage — CFS handling, haulage, terminal, freight, brokerage, storage — assembled into a client invoice with the evidence attached.',
    outcome:
      'No revenue leakage, and fewer billing disputes because the charges are provable.',
  },
];

// ---------------------------------------------------------------------------
// Outcomes
// ---------------------------------------------------------------------------

const OUTCOMES: readonly Outcome[] = [
  {
    value: '[VALUE]',
    label: 'Reduction in documentation holds',
    context: 'Pre-submission validation catches missing fields before filing',
  },
  {
    value: '[VALUE]',
    label: 'Faster month-end close',
    context: 'Charges captured at the transaction, not reconstructed later',
  },
  {
    value: '[VALUE]',
    label: 'LCL damage disputes resolved in your favour',
    context: 'Receiving inspection evidence at both ends of the journey',
  },
  {
    value: '100%',
    label: 'Movements with audit trail',
    context: 'Append-only, enforced at the database, not by convention',
  },
];

// ---------------------------------------------------------------------------
// Integrations
// ---------------------------------------------------------------------------

const INTEGRATIONS: readonly Integration[] = [
  {
    category: 'Carriers',
    systems: [
      '[CARRIER 1]',
      '[CARRIER 2]',
      '[CARRIER 3]',
      'And your own contracted lines via API',
    ],
    note: 'Rate, schedule, and tracking integration for major ocean and air carriers.',
  },
  {
    category: 'Customs',
    systems: [
      'JKDM declaration systems (Malaysia)',
      '[OTHER CUSTOMS AUTHORITIES]',
      'Broker EDI connections',
    ],
    note: 'Declaration preparation and submission integration per jurisdiction.',
  },
  {
    category: 'CFS and terminal',
    systems: [
      'Gate systems',
      'Weighbridges',
      'Yard management',
      'Container scanners',
    ],
    note: 'Terminal-side integration for gate-in, gate-out, and yard events.',
  },
  {
    category: 'Enterprise systems',
    systems: [
      'SAP',
      'Oracle',
      'Microsoft Dynamics 365',
      'NetSuite',
      'Infor',
    ],
    note: 'ERP integration for orders, invoicing, and financial reconciliation.',
  },
];

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

function Hero() {
  return (
    <header className="relative overflow-hidden border-b">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,theme(colors.blue.500/0.07),transparent)]"
      />
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 sm:pt-28">
        <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          Solutions · Freight forwarders
        </div>

        <h1 className="mt-6 max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          The forwarder&rsquo;s operations layer.
        </h1>

        <p className="mt-5 max-w-2xl text-pretty text-lg text-muted-foreground">
          TradeOps gives freight forwarders a single console for multi-client
          cargo moving through Container Freight Stations, Free Zones, and
          bonded facilities — with the documentation, the tracking, and the
          evidence trail that protects the margin.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            See it on your cargo
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
    </header>
  );
}

function PainPoints() {
  return (
    <section
      aria-labelledby="pain-heading"
      className="mx-auto max-w-7xl px-4 py-16"
    >
      <div className="max-w-2xl">
        <h2
          id="pain-heading"
          className="text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          What actually goes wrong.
        </h2>
        <p className="mt-3 text-muted-foreground">
          Freight forwarding is a business of orchestrating parties who do
          not share a system. The four problems below are the ones we hear
          most often, from forwarders of every size.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {PAIN_POINTS.map((point) => (
          <article
            key={point.id}
            className="flex flex-col rounded-xl border bg-background p-6"
          >
            <h3 className="text-base font-semibold">{point.problem}</h3>
            <p className="mt-3 flex-1 text-sm text-muted-foreground">
              {point.reality}
            </p>
            <p className="mt-4 border-t pt-4 text-sm font-medium text-amber-700 dark:text-amber-500">
              {point.cost}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Capabilities() {
  return (
    <section
      aria-labelledby="capabilities-heading"
      className="border-y bg-muted/20"
    >
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="max-w-2xl">
          <h2
            id="capabilities-heading"
            className="text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            What TradeOps gives you.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Six capabilities, each designed around the daily reality of
            running a forwarding operation, not a generic supply chain
            platform&rsquo;s feature list.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((capability) => (
            <article
              key={capability.id}
              className="group flex flex-col rounded-xl border bg-background p-6 transition-shadow hover:shadow-md"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border bg-muted/30 text-foreground">
                {capability.icon}
              </div>

              <h3 className="mt-4 text-base font-semibold">
                {capability.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {capability.description}
              </p>

              <ul className="mt-4 space-y-1.5 border-t pt-4 text-sm">
                {capability.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span
                      aria-hidden="true"
                      className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-muted-foreground/60"
                    />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Workflow() {
  return (
    <section
      aria-labelledby="workflow-heading"
      className="mx-auto max-w-7xl px-4 py-16"
    >
      <div className="max-w-2xl">
        <h2
          id="workflow-heading"
          className="text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          From booking to billing.
        </h2>
        <p className="mt-3 text-muted-foreground">
          Seven stages from the moment the client sends a booking to the
          moment the invoice is delivered. Every stage produces a record that
          stands up to review.
        </p>
      </div>

      <ol className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {WORKFLOW.map((step) => (
          <li
            key={step.number}
            className="flex flex-col rounded-xl border bg-background p-6"
          >
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-semibold tabular-nums text-muted-foreground/40">
                {step.number}
              </span>
              <h3 className="text-base font-semibold">{step.title}</h3>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {step.description}
            </p>
            <p className="mt-4 border-t pt-4 text-sm font-medium text-emerald-700 dark:text-emerald-500">
              {step.outcome}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Outcomes() {
  return (
    <section
      aria-labelledby="outcomes-heading"
      className="border-y bg-muted/30"
    >
      <div className="mx-auto max-w-7xl px-4 py-14">
        <h2 id="outcomes-heading" className="sr-only">
          Outcomes
        </h2>

        <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {OUTCOMES.map((outcome) => (
            <div key={outcome.label}>
              <dd className="text-3xl font-semibold tabular-nums tracking-tight">
                {outcome.value}
              </dd>
              <dt className="mt-1 text-sm font-medium">{outcome.label}</dt>
              <p className="mt-1 text-xs text-muted-foreground">
                {outcome.context}
              </p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Testimonial() {
  return (
    <section
      aria-labelledby="testimonial-heading"
      className="mx-auto max-w-4xl px-4 py-16"
    >
      <h2 id="testimonial-heading" className="sr-only">
        What forwarders say
      </h2>

      <figure className="rounded-2xl border bg-background p-8 sm:p-10">
        <QuoteIcon className="h-8 w-8 text-muted-foreground/30" />
        <blockquote className="mt-6 text-pretty text-lg leading-relaxed text-foreground/90 sm:text-xl">
          We were running eleven client accounts across four different
          systems. The moment that changed was when we could finally see a
          single shipment&rsquo;s full history — receiving inspection at
          origin, the consolidation, the seal number, the bill of lading, the
          clearance, the delivery. When a client calls about a damage claim
          now, we open the file and answer in five minutes.
        </blockquote>
        <figcaption className="mt-8 border-t pt-6">
          <div className="text-sm font-medium">[FULL NAME]</div>
          <div className="text-xs text-muted-foreground">
            [ROLE] · [FORWARDER COMPANY NAME]
          </div>
        </figcaption>
      </figure>
    </section>
  );
}

function Integrations() {
  return (
    <section
      aria-labelledby="integrations-heading"
      className="border-t bg-muted/20"
    >
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="max-w-2xl">
          <h2
            id="integrations-heading"
            className="text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            Fits into the stack you already run.
          </h2>
          <p className="mt-3 text-muted-foreground">
            TradeOps is an orchestration layer, not a replacement for the
            systems your clients and partners already use. The integrations
            below are the ones most commonly deployed.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {INTEGRATIONS.map((integration) => (
            <article
              key={integration.category}
              className="rounded-xl border bg-background p-6"
            >
              <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                {integration.category}
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                {integration.systems.map((system) => (
                  <li key={system} className="flex items-start gap-2">
                    <span
                      aria-hidden="true"
                      className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-muted-foreground/60"
                    />
                    <span>{system}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t pt-4 text-xs text-muted-foreground">
                {integration.note}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20">
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-muted/60 to-background px-6 py-14 text-center sm:px-12">
        <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
          Bring one of your hardest client accounts.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-pretty text-muted-foreground">
          We will walk it through the full lifecycle — booking, carrier
          selection, CFS consolidation, documentation, clearance, and
          billing — on the shipment that causes you the most pain today.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Book a walkthrough
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Contact sales
          </Link>
        </div>
      </div>
    </section>
  );
}

function StructuredData() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    isPartOf: { '@type': 'WebSite', url: BASE_URL, name: 'TradeOps' },
    audience: {
      '@type': 'BusinessAudience',
      audienceType: 'Freight forwarders',
    },
    about: CAPABILITIES.map((c) => ({
      '@type': 'Service',
      name: c.title,
      description: c.description,
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
      <PainPoints />
      <Capabilities />
      <Workflow />
      <Outcomes />
      <Testimonial />
      <Integrations />
      <FinalCTA />
    </main>
  );
}