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
 *   1. Replace the TESTIMONIAL with a real quote from an FCZ operator who
 *      has approved the attribution. Do not invent a name or a title.
 *
 *   2. Replace the OUTCOMES metrics with numbers drawn from a real
 *      deployment. Do not publish a metric you cannot substantiate.
 *
 *   3. Replace the INTEGRATIONS with the trading, WMS, and terminal systems
 *      you actually support. Do not list an integration you do not have.
 *
 *   4. Confirm any quoted improvement percentage is drawn from a real
 *      engagement and the customer has approved its use.
 *
 * If you have no FCZ operators as customers yet, remove the testimonial and
 * outcomes sections and ship the page with the capabilities and workflow
 * sections only.
 * ============================================================================
 */

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

const BASE_URL = 'https://tradeops.example';
const PAGE_URL = `${BASE_URL}/solutions/fcz`;
const PAGE_TITLE = 'TradeOps for Free Commercial Zones';
const PAGE_DESCRIPTION =
  'Duty-suspended storage, ownership tracking, value-added operations, ' +
  'and transhipment coordination for trading and distribution operations ' +
  'inside a Free Commercial Zone.';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    'Free Commercial Zone',
    'FCZ trading',
    'duty suspension',
    'transhipment',
    'repacking',
    'relabelling',
    'break-bulk',
    'regional distribution',
    'customs commercial zone',
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

function ExchangeIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m16 3 4 4-4 4" />
      <path d="M20 7H4" />
      <path d="m8 21-4-4 4-4" />
      <path d="M4 17h16" />
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

function ShipIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76" />
      <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6" />
      <path d="M12 10v4" />
      <path d="M12 2v3" />
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
// Pain points — what actually goes wrong for an FCZ operator
// ---------------------------------------------------------------------------

const PAIN_POINTS: readonly PainPoint[] = [
  {
    id: 'ownership',
    problem: 'Goods change hands inside the zone without physically moving.',
    reality:
      'A container sits in bonded storage. Over six weeks, it is traded three times. Each transfer is a customs event with a declaration obligation, but the container does not move, so nothing triggers the paperwork. By the time customs asks who owned the goods on a given date, the trail has gone cold.',
    cost:
      'A chain-of-title gap that exposes both you and your tenants to compliance findings, and that no spreadsheet can reconstruct after the fact.',
  },
  {
    id: 'value-add',
    problem: 'Repacking, relabelling, and kitting quietly change the customs character.',
    reality:
      'You receive bulk cartons, repack them into retail units, apply a new label, and ship them out. The goods look different at exit than they did on entry — different HS code at the 8-digit level, different origin determination, potentially different preferential treatment. Each operation is a customs event that most systems do not capture.',
    cost:
      'Under-declared duty at exit, discovered at audit, with penalties calculated against the classification gap that accumulated over years.',
  },
  {
    id: 'transhipment',
    problem: 'Transhipment has a clock, and the clock is silent.',
    reality:
      'Cargo arrives on one vessel and departs on another. Between arrival and departure, it is in a bonded hold with strict time limits. A missed window converts transhipment into an import, and the duty is assessed on the spot. Nothing in a standard TOS warns you that you have crossed the line.',
    cost:
      'Duty becoming payable on cargo that was never meant to enter the domestic market, plus the administrative cost of regularising it.',
  },
  {
    id: 'throughput',
    problem: 'Throughput and documentation are in permanent tension.',
    reality:
      'Every FCZ operator optimises for velocity: fewer touches, shorter dwell, faster gate turns. Customs wants evidence: who, what, when, how much, where it went. When documentation is a separate process — a step a person has to remember — velocity wins and the documentation loses.',
    cost:
      'Reconciliation that never quite closes, discovered only when someone asks why the bonded balance does not match the physical stock.',
  },
  {
    id: 'duty-at-exit',
    problem: 'Duty at exit is calculated on goods that no longer look like what entered.',
    reality:
      'Goods enter as bulk. They leave as retail packs, sometimes relabelled, sometimes mixed with goods from another origin, sometimes kitted with accessories from a third origin. Duty is payable on the goods as they exist at exit, not on what came in. Reconstructing that value — and the correct classification — from a stack of warehouse records is a per-shipment calculation.',
    cost:
      'Systematic misvaluation at the point of exit, invisible until a customs review surfaces the pattern.',
  },
];

// ---------------------------------------------------------------------------
// Capabilities — how TradeOps addresses each
// ---------------------------------------------------------------------------

const CAPABILITIES: readonly Capability[] = [
  {
    id: 'ownership',
    title: 'Ownership and title tracking',
    description:
      'Every transfer of ownership inside the zone is captured as a customs event, with a full chain of title that survives the container never moving.',
    features: [
      'Ownership chain per consignment with timestamps',
      'Automatic declaration for each transfer',
      'Buyer, seller, and intermediary records',
      'Historical ownership query by any point in time',
    ],
    icon: <ExchangeIcon className="h-5 w-5" />,
  },
  {
    id: 'value-add',
    title: 'Value-added operation control',
    description:
      'Repacking, relabelling, kitting, sampling, and grading are captured as declared operations, each with its own customs impact assessment.',
    features: [
      'Operation routing with customs impact evaluation',
      'Input-output reconciliation per operation',
      'HS classification review at each transformation',
      'Origin re-determination when goods are mixed',
    ],
    icon: <PackageIcon className="h-5 w-5" />,
  },
  {
    id: 'transhipment',
    title: 'Transhipment time-limit management',
    description:
      'Every consignment in transhipment holds a countdown. Approaching cutoffs trigger alerts before the deadline passes, not after.',
    features: [
      'Per-consignment transhipment clock',
      'Alerts at 75%, 50%, and 25% of the allowed window',
      'Escalation to the operations team before expiry',
      'Automatic documentation of the transhipment event',
    ],
    icon: <ShipIcon className="h-5 w-5" />,
  },
  {
    id: 'throughput',
    title: 'High-velocity gate operations',
    description:
      'Customs documentation is produced as a byproduct of the physical operation, not as a separate step. The gate turn is the same whether the goods move domestically or in bond.',
    features: [
      'Barcode and RFID-driven gate events',
      'Weighbridge and scanner integration',
      'Automatic declaration trigger on movement',
      'Sub-second gate decision, documentation written in parallel',
    ],
    icon: <GaugeIcon className="h-5 w-5" />,
  },
  {
    id: 'duty',
    title: 'Duty calculation at point of exit',
    description:
      'When goods leave the zone for the domestic market, the duty is calculated on the goods as they exist at that moment — with the value-addition chain and the correct classification attached.',
    features: [
      'Exit valuation with value-addition provenance',
      'Current-tariff classification at 8-digit level',
      'FTA and RCEP origin resolution',
      'Per-shipment declaration with evidence chain',
    ],
    icon: <CalculatorIcon className="h-5 w-5" />,
  },
  {
    id: 'audit',
    title: 'Continuous audit readiness',
    description:
      'The bonded balance is reconciled continuously against the physical stock. When customs arrives, the reconciliation is a report, not a project.',
    features: [
      'Append-only audit log enforced at the database',
      'Real-time bonded balance by owner, by commodity, by location',
      'Customs audit pack generation on demand',
      'Discrepancy detection with root-cause drill-down',
    ],
    icon: <ShieldCheckIcon className="h-5 w-5" />,
  },
];

// ---------------------------------------------------------------------------
// Workflow — the commercial lifecycle inside an FCZ
// ---------------------------------------------------------------------------

const WORKFLOW: readonly WorkflowStep[] = [
  {
    number: '01',
    title: 'Inbound receipt',
    description:
      'Cargo arrives by sea, air, or land. The inbound declaration is validated, the quantity and condition are recorded, and the consignment is registered against the applicable customs regime — transhipment, bonded storage, or entry for trading.',
    outcome:
      'Every consignment enters the zone under a specific, documented regime.',
  },
  {
    number: '02',
    title: 'Bonded registration',
    description:
      'The consignment is assigned to a bonded location and to an owner of record. The owner is not necessarily the importer; it is whoever holds title at that moment, and the record establishes the starting point of the chain.',
    outcome:
      'Ownership is explicit from the first moment of bonded storage.',
  },
  {
    number: '03',
    title: 'Ownership transfer',
    description:
      'A trade occurs. Title passes from one party to another, but the goods do not move. TradeOps records the transfer as a customs event, produces the required declaration, and appends the change to the consignment history.',
    outcome:
      'Every trade is captured, regardless of whether the goods moved.',
  },
  {
    number: '04',
    title: 'Value-added operations',
    description:
      'Repacking, relabelling, kitting, sampling, or grading. Each operation is captured with its input and output. If the operation changes the customs character — a different HS code, a different origin — that change is registered as part of the operation record.',
    outcome:
      'The customs character of the goods is provably transformed, with evidence.',
  },
  {
    number: '05',
    title: 'Transhipment or storage decision',
    description:
      'Consignments under transhipment hold are tracked against a live clock. As the allowed window narrows, alerts fire. Storage decisions — move it to bonded storage, ship it onward, or clear it for entry — are made with the deadline visible.',
    outcome:
      'Transhipment windows are managed, not discovered after the fact.',
  },
  {
    number: '06',
    title: 'Outbound declaration',
    description:
      'Goods leave for re-export, for domestic consumption, or for another zone. The correct regime is applied. Duty is calculated on the goods as they exist at exit, with the value-addition chain attached.',
    outcome:
      'Duty payable is calculated on the correct basis, with the provenance chain.',
  },
  {
    number: '07',
    title: 'Continuous reconciliation',
    description:
      'The bonded balance — physical stock, ownership records, customs declarations — reconciles continuously. Discrepancies surface as they appear, not at the annual audit. When customs asks for the balance, the answer is a report, not a project.',
    outcome:
      'The bonded ledger is always current, always provable.',
  },
];

// ---------------------------------------------------------------------------
// Outcomes
// ---------------------------------------------------------------------------

const OUTCOMES: readonly Outcome[] = [
  {
    value: '[VALUE]',
    label: 'Reduction in customs reconciliation effort',
    context: 'Continuous balance versus month-end reconstruction',
  },
  {
    value: '[VALUE]',
    label: 'Transhipment window compliance',
    context: 'Consignments departing within the allowed window',
  },
  {
    value: '[VALUE]',
    label: 'Reduction in audit findings',
    context: 'Ownership, classification, and value chains provable at review',
  },
  {
    value: '100%',
    label: 'Ownership transfers captured',
    context: 'Every trade recorded as a customs event, not reconstructed later',
  },
];

// ---------------------------------------------------------------------------
// Integrations
// ---------------------------------------------------------------------------

const INTEGRATIONS: readonly Integration[] = [
  {
    category: 'Trading and order systems',
    systems: [
      'SAP SD and MM',
      'Oracle Order Management',
      'Microsoft Dynamics 365 Supply Chain',
      'NetSuite',
      'Custom trading platforms',
    ],
    note: 'Purchase orders, sales orders, and trade confirmations flow into the ownership chain. Each trade is a customs event, not just a commercial one.',
  },
  {
    category: 'Warehouse and terminal',
    systems: [
      'WMS and WCS',
      'Terminal Operating Systems (TOS)',
      'Yard management',
      'Gate and weighbridge systems',
      'Container scanners',
    ],
    note: 'Physical movement events feed the bonded ledger. The gate turn and the customs declaration are produced in the same operation.',
  },
  {
    category: 'Carriers and logistics',
    systems: [
      'Ocean carrier APIs',
      'Air cargo systems',
      'Freight forwarder platforms',
      'Haulage and inland transport',
    ],
    note: 'Sailing schedules, cutoffs, and tracking events. Transhipment windows are calculated against the actual carrier schedule, not a static rule.',
  },
  {
    category: 'Customs and government',
    systems: [
      'JKDM declaration systems (Malaysia)',
      'Free Zone authority systems',
      'MITI licensing systems',
      'Broker EDI connections',
    ],
    note: 'Declaration preparation and submission integration. The zone authority and customs remain the authoritative destination for the declarations TradeOps prepares.',
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
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,theme(colors.emerald.500/0.07),transparent)]"
      />
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 sm:pt-28">
        <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Solutions · Free Commercial Zone
        </div>

        <h1 className="mt-6 max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Trade at the speed of the market.
        </h1>

        <p className="mt-5 max-w-2xl text-pretty text-lg text-muted-foreground">
          TradeOps runs the customs ledger for commercial operations inside a
          Free Commercial Zone — tracking ownership through every trade,
          capturing value-added operations, managing transhipment windows,
          and calculating duty at the point of exit.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            See it on your own cargo
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
          In a Free Commercial Zone, goods are not manufactured. They are
          traded, repacked, relabelled, and moved. The customs exposure is not
          about material balance — it is about ownership, transformation, and
          time.
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
            Six capabilities, each designed around the customs obligations of
            a commercial operator inside a Free Commercial Zone.
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
          From arrival to exit.
        </h2>
        <p className="mt-3 text-muted-foreground">
          Seven stages covering the full commercial lifecycle of cargo inside
          a Free Commercial Zone. Every stage produces a record that customs
          can trace, whether or not the goods physically moved.
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
        What FCZ operators say
      </h2>

      <figure className="rounded-2xl border bg-background p-8 sm:p-10">
        <QuoteIcon className="h-8 w-8 text-muted-foreground/30" />
        <blockquote className="mt-6 text-pretty text-lg leading-relaxed text-foreground/90 sm:text-xl">
          We had a consignment that was traded four times before it left the
          zone. When customs asked who owned it on a specific date — six
          months after the fact — we answered in two minutes. Before TradeOps,
          that question would have taken a week of emails to reconstruct, and
          we might not have been able to answer it at all.
        </blockquote>
        <figcaption className="mt-8 border-t pt-6">
          <div className="text-sm font-medium">[FULL NAME]</div>
          <div className="text-xs text-muted-foreground">
            [ROLE] · [TRADING COMPANY NAME]
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
            Fits into the systems you already run.
          </h2>
          <p className="mt-3 text-muted-foreground">
            TradeOps is the customs ledger. It reads from your trading, WMS,
            and terminal systems and maintains the duty-suspension accounting
            that none of them are designed to produce.
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
          Bring your messiest consignment.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-pretty text-muted-foreground">
          We will walk it through the full lifecycle — arrival, bonded
          registration, ownership transfers, value-added operations,
          transhipment or exit — and show you the customs record at the end.
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
      audienceType: 'Free Commercial Zone operators',
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