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
 *   1. Replace the TESTIMONIAL with a real quote from a customs broker who
 *      has approved the attribution. Do not invent a name or a title.
 *
 *   2. Replace the OUTCOMES metrics with numbers drawn from a real
 *      deployment. Do not publish a metric you cannot substantiate.
 *
 *   3. Replace the INTEGRATIONS with the customs systems, ERP connectors,
 *      and broker platforms you actually support. Do not list an
 *      integration you do not have.
 *
 *   4. Confirm any quoted improvement percentage is drawn from a real
 *      engagement and the customer has approved its use.
 *
 * If you have no customs brokers as customers yet, remove the testimonial
 * and outcomes sections and ship the page with the capabilities and workflow
 * sections only.
 * ============================================================================
 */

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

const BASE_URL = 'https://tradeops.example';
const PAGE_URL = `${BASE_URL}/solutions/brokers`;
const PAGE_TITLE = 'TradeOps for Customs Brokers';
const PAGE_DESCRIPTION =
  'Declaration preparation at scale, HS classification with sourced rates, ' +
  'tariff change monitoring, audit defence, and per-declaration billing for ' +
  'customs brokers handling cross-border trade on behalf of importers and ' +
  'exporters.';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    'customs broker software',
    'declaration preparation',
    'HS classification',
    'tariff change management',
    'customs brokerage platform',
    'declaration billing',
    'trade compliance',
    'JKDM integration',
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

function ScaleIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
    </svg>
  );
}

function FileStackIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M8 13h8" />
      <path d="M8 17h8" />
      <path d="M8 9h2" />
    </svg>
  );
}

function BellRingIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      <path d="M18 8a6 6 0 0 0-.44-2.22" />
      <path d="M6.44 5.78A6 6 0 0 0 6 8" />
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

function CalculatorIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" x2="16" y1="6" y2="6" />
      <line x1="16" x2="16" y1="14" y2="18" />
      <path d="M16 10h.01" />
      <path d="M12 10h.01" />
      <path d="M8 10h.01" />
      <path d="M12 14h.01" />
      <path d="M8 14h.01" />
      <path d="M12 18h.01" />
      <path d="M8 18h.01" />
    </svg>
  );
}

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function BookOpenIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M12 7v14" />
      <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3Z" />
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
// Pain points — what actually goes wrong for a customs broker
// ---------------------------------------------------------------------------

const PAIN_POINTS: readonly PainPoint[] = [
  {
    id: 'tariff-velocity',
    problem: 'The tariff changes faster than any team can track.',
    reality:
      'Customs Duties Order amendments, Excise Duties Order changes, Sales Tax Orders, FTA schedule updates, control-list revisions. Each instrument lands as a PDF in the Federal Gazette, and each one ripples into thousands of past declarations that are now wrong, and thousands of future declarations that have not yet been filed. The team finds out about the change when a client asks why their rate moved.',
    cost:
      'Clients billed at outdated rates, declarations rejected at submission, and a growing backlog of corrections that were never filed.',
  },
  {
    id: 'classification-defence',
    problem: 'Classification is easy to assert and hard to defend.',
    reality:
      'Every declaration is an assertion about what the good is, where it came from, and what it is worth. When customs challenges a classification — sometimes years later — the broker needs the reasoning, the source, the ruling reference, and the client\u2019s product information. That file does not exist in a system that stores only the code that was filed.',
    cost:
      'Customs findings that the broker cannot rebut, penalties that flow through to the client, and a reputation cost that is harder to price.',
  },
  {
    id: 'throughput',
    problem: 'Declaration volume scales with clients, but headcount does not.',
    reality:
      'Each new client brings a new commodity mix, a new origin pattern, and a new set of documentation quirks. The declaration workflow is largely manual: read the invoice, identify the goods, look up the code, enter the fields, file, follow up on queries. Volume grows, and the team cannot.',
    cost:
      'Either the broker stops taking on new clients, or quality drops, or both.',
  },
  {
    id: 'queries',
    problem: 'Customs queries arrive and sit in a broker\u2019s inbox.',
    reality:
      'A declaration is flagged for inspection, or customs asks for a clarification, or a rate is disputed. The query is filed somewhere and the client is waiting. Whether the query is answered within the client\u2019s tolerance is the difference between a satisfied client and a churned one, and the broker has no visibility into how many are outstanding at any moment.',
    cost:
      'Client churn caused by queries that were answered late, or not at all, because they fell through the cracks.',
  },
  {
    id: 'billing',
    problem: 'Every declaration is a small fee, and the volume is enormous.',
    reality:
      'A broker files hundreds of declarations per client per month, each with its own disbursement structure, its own government fee, its own professional fee, and its own treatment of customs duty (which the broker usually advances and passes through). Reconciling the disbursements, recovering the advances, and billing the professional fees is a monthly reconciliation of tens of thousands of line items.',
    cost:
      'Revenue leakage on small fees that never got billed, and cash trapped in advances that were never recovered.',
  },
];

// ---------------------------------------------------------------------------
// Capabilities — how TradeOps addresses each
// ---------------------------------------------------------------------------

const CAPABILITIES: readonly Capability[] = [
  {
    id: 'classification',
    title: 'HS classification with sources',
    description:
      'Every classification is proposed by an agent, verified by a broker, and stored with the reasoning and the source. When customs asks why a code was chosen, the answer is in the file.',
    features: [
      'Agent-assisted HS suggestion with confidence scores',
      'Source-cited rates and rulings attached to each code',
      'Broker review and approval before filing',
      'Historical classification query by client, by product, by date',
    ],
    icon: <BookOpenIcon className="h-5 w-5" />,
  },
  {
    id: 'tariff-changes',
    title: 'Tariff change monitoring',
    description:
      'Every amendment to the Customs Duties Order, Excise Duties Order, and Sales Tax Orders is monitored, diffed against the current dataset, and surfaced with the impact on your clients.',
    features: [
      'Gazette monitoring with alert on new instruments',
      'Rate diff against the current dataset',
      'Client impact assessment per change',
      'Retroactive correction queue for past declarations',
    ],
    icon: <BellRingIcon className="h-5 w-5" />,
  },
  {
    id: 'declaration',
    title: 'High-throughput declaration preparation',
    description:
      'Template-driven declaration preparation that reads from client invoices, EDI feeds, and ERP integrations. Broker review is focused on exceptions, not on data entry.',
    features: [
      'Templates per client and per commodity class',
      'Invoice and packing list parsing',
      'Pre-submission validation against customs rules',
      'Exception queue for broker review',
    ],
    icon: <FileStackIcon className="h-5 w-5" />,
  },
  {
    id: 'queries',
    title: 'Query management',
    description:
      'Every customs query is a tracked case with an owner, a deadline, and a status. The client sees the status. The broker sees the queue.',
    features: [
      'Query intake from customs with routing',
      'Per-query SLA tracking and escalation',
      'Client-visible status without exposing customs correspondence',
      'Response templates per query type',
    ],
    icon: <ScaleIcon className="h-5 w-5" />,
  },
  {
    id: 'audit-defence',
    title: 'Audit defence file',
    description:
      'Every declaration, every classification, every valuation is stored with the evidence that supports it. When customs audits a broker\u2019s client, the file assembles itself.',
    features: [
      'Append-only audit log per declaration',
      'Source documents linked to each assertion',
      'Historical queries (what was filed on this date for this client?)',
      'Audit pack generation for customs or for the client',
    ],
    icon: <ShieldCheckIcon className="h-5 w-5" />,
  },
  {
    id: 'billing',
    title: 'Per-declaration billing and disbursements',
    description:
      'Every declaration produces a client invoice line with the professional fee, the government fee, and the disbursement. Customs duty advanced on the client\u2019s behalf is tracked until recovered.',
    features: [
      'Per-client fee schedules with minimums',
      'Government fee and disbursement tracking',
      'Advance tracking and recovery reconciliation',
      'Client statements with drill-down per declaration',
    ],
    icon: <CalculatorIcon className="h-5 w-5" />,
  },
];

// ---------------------------------------------------------------------------
// Workflow — the customs broker's day
// ---------------------------------------------------------------------------

const WORKFLOW: readonly WorkflowStep[] = [
  {
    number: '01',
    title: 'Client instruction intake',
    description:
      'The client sends the shipment details by email, EDI, or client portal. The instruction is validated against the client\u2019s profile \u2014 their commodity mix, their origin patterns, their documentation preferences \u2014 and any missing information is requested immediately.',
    outcome:
      'Incomplete instructions caught at intake, not at submission.',
  },
  {
    number: '02',
    title: 'Classification',
    description:
      'The goods are classified. A suggested HS code is produced by the agent, along with a confidence score, the source rate, and a citation. The broker reviews the suggestion, adjusts it if necessary, and approves the final classification. The reasoning and the source are stored with the declaration.',
    outcome:
      'Every classification is broker-approved, source-cited, and defensible.',
  },
  {
    number: '03',
    title: 'Valuation and origin',
    description:
      'The customs value is computed from the invoice, with adjustments for freight, insurance, and any related-party transactions. Origin is determined against the applicable FTA rules \u2014 ATIGA, RCEP, CPTPP \u2014 with the evidence required for a preferential rate identified before filing.',
    outcome:
      'Duty and tax calculated on the correct basis, with origin evidence on file.',
  },
  {
    number: '04',
    title: 'Declaration preparation',
    description:
      'The declaration is assembled from the classified goods, the valued consignment, and the origin determination. Field-level validation runs against the current customs rules. Exceptions are queued for the broker; routine lines pass through.',
    outcome:
      'Only the exceptions reach the broker. Volume scales without proportional headcount.',
  },
  {
    number: '05',
    title: 'Submission and tracking',
    description:
      'The declaration is submitted to the customs system. Status is tracked through acceptance, assessment, payment, and release. Any query from customs is routed to a named broker with a deadline.',
    outcome:
      'Every declaration has a state, a next action, and an owner.',
  },
  {
    number: '06',
    title: 'Query resolution',
    description:
      'Queries are tracked to closure, with client-visible status and internal escalation. Responses are templated per query type, and the closure is recorded with the evidence attached.',
    outcome:
      'Queries closed within the client\u2019s tolerance, with a defensible record.',
  },
  {
    number: '07',
    title: 'Billing and disbursement recovery',
    description:
      'Every declaration produces a client invoice line: professional fee, government fee, and disbursement. Customs duty advanced on the client\u2019s behalf is tracked until recovered. Client statements are assembled with drill-down to the underlying declarations.',
    outcome:
      'No fee unbilled, no advance unrecovered, no client dispute without evidence.',
  },
];

// ---------------------------------------------------------------------------
// Outcomes
// ---------------------------------------------------------------------------

const OUTCOMES: readonly Outcome[] = [
  {
    value: '[VALUE]',
    label: 'Reduction in declaration preparation time',
    context: 'Exceptions-only broker review, template-driven assembly',
  },
  {
    value: '[VALUE]',
    label: 'Classification queries answered within SLA',
    context: 'Query tracking with per-query deadline and owner',
  },
  {
    value: '[VALUE]',
    label: 'Reduction in tariff change response time',
    context: 'Gazette monitoring with client impact assessment',
  },
  {
    value: '100%',
    label: 'Declarations with a defence file',
    context: 'Source-cited classification stored with each declaration',
  },
];

// ---------------------------------------------------------------------------
// Integrations
// ---------------------------------------------------------------------------

const INTEGRATIONS: readonly Integration[] = [
  {
    category: 'Customs systems',
    systems: [
      'JKDM declaration systems (Malaysia)',
      'ASEAN Single Window',
      'FTA origin verification systems',
      'Permit and licensing systems (MITI, MAQIS, etc.)',
    ],
    note: 'Declaration preparation and submission integration, with the customs authority as the authoritative destination for the filed declaration.',
  },
  {
    category: 'Client systems',
    systems: [
      'SAP',
      'Oracle',
      'Microsoft Dynamics 365',
      'NetSuite',
      'Custom client portals and EDI',
    ],
    note: 'Commercial invoices, packing lists, and purchase orders flow in. TradeOps reads from the client\u2019s system and writes the customs-facing record.',
  },
  {
    category: 'Carriers and forwarders',
    systems: [
      'Ocean carrier APIs',
      'Air cargo systems',
      'Freight forwarder platforms',
      'CFS and terminal systems',
    ],
    note: 'Shipment details, arrival notices, and documentation feeds. Broker instructions arrive with the shipment data attached.',
  },
  {
    category: 'Financial',
    systems: [
      'Accounting and ERP',
      'Banking and payment systems',
      'Duty payment and drawback recovery',
      'Client billing and statements',
    ],
    note: 'Government fee disbursements, duty advances, and client billing feed the broker\u2019s own accounting system, not the other way around.',
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
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,theme(colors.violet.500/0.07),transparent)]"
      />
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 sm:pt-28">
        <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
          Solutions · Customs brokers
        </div>

        <h1 className="mt-6 max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Every classification, defensible.
        </h1>

        <p className="mt-5 max-w-2xl text-pretty text-lg text-muted-foreground">
          TradeOps is the declaration platform for customs brokers \u2014
          classification with sources, tariff change monitoring, query
          tracking, per-declaration billing, and the audit file that stands up
          when customs asks the question two years later.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            See it on your commodity mix
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
          A customs broker\u2019s product is the declaration. The problem is
          not warehousing, forwarding, or storage. It is classification
          accuracy, tariff velocity, and the ability to defend what was filed
          months or years ago.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
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
            Six capabilities, each designed around the specific obligations of
            a customs broker: classification accuracy, tariff tracking,
            declaration throughput, query management, audit defence, and
            per-declaration billing.
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
          From instruction to recovery.
        </h2>
        <p className="mt-3 text-muted-foreground">
          Seven stages from the client\u2019s instruction to the recovered
          disbursement. Every stage produces a record that can be presented to
          customs or to the client.
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
        What customs brokers say
      </h2>

      <figure className="rounded-2xl border bg-background p-8 sm:p-10">
        <QuoteIcon className="h-8 w-8 text-muted-foreground/30" />
        <blockquote className="mt-6 text-pretty text-lg leading-relaxed text-foreground/90 sm:text-xl">
          Customs asked us to justify a classification we had filed three
          years ago, on a product the client had stopped importing. We opened
          the file, and the reasoning, the ruling reference, and the client\u2019s
          product specification were all there, attached to the original
          declaration. That conversation took fifteen minutes. It would have
          taken us weeks to reconstruct, if we could have reconstructed it at
          all.
        </blockquote>
        <figcaption className="mt-8 border-t pt-6">
          <div className="text-sm font-medium">[FULL NAME]</div>
          <div className="text-xs text-muted-foreground">
            [ROLE] \u00b7 [BROKERAGE FIRM NAME]
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
            Fits into the systems your clients already run.
          </h2>
          <p className="mt-3 text-muted-foreground">
            TradeOps is the declaration and classification platform. It reads
            from your clients\u2019 ERP systems, from carrier and forwarder
            feeds, and from customs systems, and produces the filed
            declaration and the client invoice.
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
          Bring a classification you have been asked to defend.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-pretty text-muted-foreground">
          Give us a commodity, a client, and a code you filed. We will show
          you the source, the reasoning, and the file that customs would see
          if they asked today.
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
      audienceType: 'Customs brokers',
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