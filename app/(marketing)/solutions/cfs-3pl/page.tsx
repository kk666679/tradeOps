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
 *   1. Replace the TESTIMONIAL with a real quote from a CFS or 3PL operator
 *      who has approved the attribution. Do not invent a name or a title.
 *
 *   2. Replace the OUTCOMES metrics with numbers drawn from a real
 *      deployment. Do not publish a metric you cannot substantiate.
 *
 *   3. Replace the INTEGRATIONS with the WMS, TOS, and carrier systems you
 *      actually support. Do not list an integration you do not have.
 *
 *   4. Confirm any quoted improvement percentage is drawn from a real
 *      engagement and the customer has approved its use.
 *
 * If you have no CFS or 3PL operators as customers yet, remove the
 * testimonial and outcomes sections and ship the page with the capabilities
 * and workflow sections only.
 * ============================================================================
 */

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

const BASE_URL = 'https://tradeops.example';
const PAGE_URL = `${BASE_URL}/solutions/cfs-3pl`;
const PAGE_TITLE = 'TradeOps for CFS and 3PL Operators';
const PAGE_DESCRIPTION =
  'Multi-client warehouse and Container Freight Station operations with ' +
  'per-client bonded ledgers, LCL consolidation, dock scheduling, and ' +
  'per-client billing. One facility, many clients, no cross-contamination.';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    'Container Freight Station software',
    'CFS management',
    '3PL platform',
    'multi-client warehouse',
    'LCL consolidation',
    'cross-docking',
    'bonded warehouse',
    'dock scheduling',
    'per-client billing',
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

function WarehouseIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z" />
      <path d="M6 18h12" />
      <path d="M6 14h12" />
      <path d="M6 10h12" />
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

function CalendarClockIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h5" />
      <path d="M17.5 17.5 16 16.3V14" />
      <circle cx="16" cy="16" r="6" />
    </svg>
  );
}

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
// Pain points — what actually goes wrong for a CFS / 3PL operator
// ---------------------------------------------------------------------------

const PAIN_POINTS: readonly PainPoint[] = [
  {
    id: 'multi-client',
    problem: 'You hold inventory you do not own, for clients who each want their own books.',
    reality:
      'Forty clients, one facility, one dock, one labour pool. Each client has their own SKUs, their own customs treatment, their own reporting requirements, and their own expectation that their inventory is not mixed with anyone else\u2019s. The physical operation is shared; the accounting cannot be.',
    cost:
      'When one client\u2019s goods get commingled with another\u2019s \u2014 physically or in the data \u2014 the trust is damaged and the commercial relationship ends.',
  },
  {
    id: 'bonded-segregation',
    problem: 'The same warehouse holds bonded and duty-paid goods.',
    reality:
      'Bonded inventory, duty-paid inventory, goods on transhipment hold, goods awaiting clearance, goods under drawback claim. All in the same racking. Keeping each in its own customs regime is a per-location, per-SKU control that most WMS systems treat as an inventory attribute rather than a compliance obligation.',
    cost:
      'A mispicked line that moves bonded goods into a duty-paid order is a customs finding. A pattern of them is a suspension of the bonded facility.',
  },
  {
    id: 'dock-labour',
    problem: 'The dock and the labour pool are the constraint, and they are invisible in the software.',
    reality:
      'Every inbound container needs a door, a team, equipment, and a slot in the schedule. Inbound windows do not always align with outbound. Labour is scheduled by shift, but the work arrives by truck. Without a dock and labour view, the schedule is a spreadsheet that nobody trusts, and the yard becomes the buffer.',
    cost:
      'Overtime on one shift, idle time on the next, and containers sitting on chassis because the door was not available when the truck arrived.',
  },
  {
    id: 'lcl',
    problem: 'LCL consolidation is where the damage disputes live.',
    reality:
      'You receive cargo from dozens of shippers, stuff it into a shared container, and ship it to a destination CFS that will deconsolidate it. Damage discovered at destination, with no receiving inspection at origin to prove the condition when the cargo arrived at your door.',
    cost:
      'Claims you cannot defend, and clients who blame the CFS regardless of where the damage actually occurred.',
  },
  {
    id: 'per-client-billing',
    problem: 'Every touch is a chargeable event, and the invoice is a monthly reconstruction.',
    reality:
      'Receiving, put-away, storage by pallet-day, picking, packing, labelling, stretch-wrapping, gate-out, documentation, disposal. Each client has a different rate card, different minimums, different inclusions. Reconstructing the invoice for forty clients at month-end takes longer than the actual operations took.',
    cost:
      'Revenue leakage on touches nobody remembered to bill, and disputes on touches the client cannot verify.',
  },
];

// ---------------------------------------------------------------------------
// Capabilities — how TradeOps addresses each
// ---------------------------------------------------------------------------

const CAPABILITIES: readonly Capability[] = [
  {
    id: 'multi-client',
    title: 'Per-client isolation, shared facility',
    description:
      'One physical operation, forty sets of books. Each client sees only their inventory, their movements, their documents. Your operations team sees the whole facility.',
    features: [
      'Per-client data isolation enforced at the data layer',
      'Client-facing portal with read-only visibility',
      'Per-client KPIs, dashboards, and reports',
      'Cross-client operations view for the facility team',
    ],
    icon: <UsersIcon className="h-5 w-5" />,
  },
  {
    id: 'regime',
    title: 'Regime-aware location control',
    description:
      'Every location is tagged with its customs regime — bonded, duty-paid, transhipment, drawback, quarantine. Movement between regimes is a declared event, not a stock transfer.',
    features: [
      'Regime-tagged locations and SKUs',
      'Movement between regimes triggers a declaration',
      'Cross-regime control prevents mis-pick',
      'Bonded balance by client, by commodity, by location',
    ],
    icon: <WarehouseIcon className="h-5 w-5" />,
  },
  {
    id: 'lcl',
    title: 'LCL consolidation with evidence',
    description:
      'Receiving inspection with photographic evidence at origin and destination. Cargo compatibility rules enforced at the point of consolidation. Container seal recorded against every shipment stuffed into it.',
    features: [
      'Receiving inspection records with photos',
      'Cargo compatibility and segregation rules',
      'Stowage planning with weight distribution',
      'Seal number recorded per shipment per container',
    ],
    icon: <LayersIcon className="h-5 w-5" />,
  },
  {
    id: 'dock',
    title: 'Dock scheduling and labour planning',
    description:
      'Inbound and outbound windows scheduled against door availability, equipment, and labour. The schedule is the operation, not a separate system.',
    features: [
      'Door scheduling with conflict detection',
      'Labour requirement estimation per shipment type',
      'Equipment assignment and availability',
      'Real-time dock status and yard view',
    ],
    icon: <CalendarClockIcon className="h-5 w-5" />,
  },
  {
    id: 'value-added',
    title: 'Value-added services as declared operations',
    description:
      'Kitting, labelling, quality inspection, sampling, returns processing. Each operation is captured with its inputs and outputs, and each produces the customs record it requires.',
    features: [
      'Operation templates with input-output tracking',
      'Per-operation labour and material capture',
      'Customs impact evaluation per operation',
      'Returns routing with disposition rules',
    ],
    icon: <ScaleIcon className="h-5 w-5" />,
  },
  {
    id: 'billing',
    title: 'Per-client billing from the transaction history',
    description:
      'Every touch is a chargeable event captured at the moment it occurs. The invoice is assembled from the transaction log, not reconstructed from memory.',
    features: [
      'Per-client rate cards with minimums and inclusions',
      'Charge capture at each operational event',
      'Invoice preview before the month closes',
      'Client-facing charge detail with evidence',
    ],
    icon: <CalculatorIcon className="h-5 w-5" />,
  },
];

// ---------------------------------------------------------------------------
// Workflow — the CFS/3PL operational lifecycle
// ---------------------------------------------------------------------------

const WORKFLOW: readonly WorkflowStep[] = [
  {
    number: '01',
    title: 'Gate-in and receiving',
    description:
      'Container or cargo arrives at the gate. Seal is verified, weighbridge reading is captured, and a receiving inspection records condition. Any exception is photographed and documented against the shipper. The regime of the inbound cargo is confirmed before it is accepted.',
    outcome:
      'Every consignment enters under a known regime, with evidence of its condition at receipt.',
  },
  {
    number: '02',
    title: 'Storage allocation',
    description:
      'The consignment is assigned to a location tagged with its regime. Bonded goods go to bonded locations. Duty-paid goods go to duty-paid locations. Cross-regime locations are not permitted, and the system enforces that.',
    outcome:
      'Physical segregation matches the customs regime, enforced by the system, not by signage.',
  },
  {
    number: '03',
    title: 'Consolidation or put-away',
    description:
      'For LCL, cargo is stuffed into a shared container with compatibility rules applied and stowage planned. For full container or pallet operations, cargo is put away into its allocated location with the client and regime attached.',
    outcome:
      'Cargo is stored or consolidated with its identity and customs treatment intact.',
  },
  {
    number: '04',
    title: 'Value-added operations',
    description:
      'Kitting, labelling, quality inspection, sampling, or returns processing. Each operation captures its inputs, its outputs, and the labour and materials consumed. Customs impact \u2014 reclassification, origin change \u2014 is evaluated as part of the operation.',
    outcome:
      'Value-added services are provable and billable, with the customs impact declared.',
  },
  {
    number: '05',
    title: 'Picking and packing',
    description:
      'Orders are picked against the client\u2019s requirements, with regime checks preventing cross-regime mis-picks. Packing captures the consumables \u2014 cartons, labels, stretch wrap \u2014 that will appear on the client invoice.',
    outcome:
      'Every pick is under the correct regime, and every consumable is captured for billing.',
  },
  {
    number: '06',
    title: 'Gate-out and shipping',
    description:
      'The shipment is staged at the dock, loaded, and released against a gate pass. For bonded goods, the outbound declaration is prepared with the full provenance chain. Seal numbers are verified and recorded at departure.',
    outcome:
      'Goods leave the facility with the correct declaration and a documented chain of custody.',
  },
  {
    number: '07',
    title: 'Billing and reconciliation',
    description:
      'Every touch from gate-in to gate-out is captured as a chargeable event. The per-client invoice is assembled from the transaction log with evidence attached. Bonded balances reconcile continuously against the physical stock.',
    outcome:
      'No revenue leakage, and a bonded balance that is provably current.',
  },
];

// ---------------------------------------------------------------------------
// Outcomes
// ---------------------------------------------------------------------------

const OUTCOMES: readonly Outcome[] = [
  {
    value: '[VALUE]',
    label: 'Reduction in month-end billing effort',
    context: 'Invoice assembled from the transaction log, not reconstructed',
  },
  {
    value: '[VALUE]',
    label: 'Reduction in cross-regime mis-picks',
    context: 'Regime enforced at the location and at the pick',
  },
  {
    value: '[VALUE]',
    label: 'Improvement in dock throughput',
    context: 'Scheduling against doors, equipment, and labour',
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
    category: 'Warehouse and terminal',
    systems: [
      'WMS and WCS',
      'Terminal Operating Systems (TOS)',
      'Yard management',
      'Gate and weighbridge systems',
      'Container scanners',
    ],
    note: 'Physical movement events feed the ledger. Gate and yard events are captured as they occur, not reconciled later.',
  },
  {
    category: 'Client and trading systems',
    systems: [
      'SAP',
      'Oracle',
      'Microsoft Dynamics 365',
      'NetSuite',
      'Custom client portals and EDI',
    ],
    note: 'Client orders, ASNs, and inventory feeds. Each client\u2019s system remains their system of record for commercial data; TradeOps owns the operational and customs record.',
  },
  {
    category: 'Carriers and logistics',
    systems: [
      'Ocean carrier APIs',
      'Air cargo systems',
      'Haulage and inland transport',
      'Freight forwarder platforms',
    ],
    note: 'Schedules, cutoffs, and tracking events. Dock and gate scheduling is calculated against the actual carrier schedule, not a static booking.',
  },
  {
    category: 'Customs and government',
    systems: [
      'JKDM declaration systems (Malaysia)',
      'Free Zone authority systems',
      'MITI licensing systems',
      'Broker EDI connections',
    ],
    note: 'Declaration preparation and submission integration. Customs and the zone authority remain the authoritative destination.',
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
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,theme(colors.amber.500/0.06),transparent)]"
      />
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 sm:pt-28">
        <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Solutions · CFS and 3PL
        </div>

        <h1 className="mt-6 max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          One facility. Forty sets of books.
        </h1>

        <p className="mt-5 max-w-2xl text-pretty text-lg text-muted-foreground">
          TradeOps runs the operational and customs ledger for CFS and 3PL
          operators \u2014 keeping each client\u2019s inventory isolated, each
          customs regime physically segregated, and every touch from gate-in to
          gate-out captured as a billable event.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            See it on your facility
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
          A CFS or 3PL operator runs a shared physical operation on behalf of
          clients whose customs treatment, commercial terms, and reporting
          expectations are all different. The problem is not warehousing \u2014
          it is keeping forty sets of obligations straight in one building.
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
            Six capabilities, each designed around the operational and customs
            obligations of a CFS or 3PL operator running a multi-client
            facility.
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
          Gate-in to gate-out.
        </h2>
        <p className="mt-3 text-muted-foreground">
          Seven stages covering the full operational lifecycle of a
          multi-client CFS or 3PL facility. Every stage produces a record that
          customs can trace and a charge that the client can verify.
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
        What CFS and 3PL operators say
      </h2>

      <figure className="rounded-2xl border bg-background p-8 sm:p-10">
        <QuoteIcon className="h-8 w-8 text-muted-foreground/30" />
        <blockquote className="mt-6 text-pretty text-lg leading-relaxed text-foreground/90 sm:text-xl">
          We used to close the month on the twelfth. Forty clients, every one
          with a different rate card and a different definition of what
          counted as a touch. Now the invoice is a preview at the end of the
          month and a final on the third. The revenue leakage we did not know
          about turned out to be bigger than the software cost.
        </blockquote>
        <figcaption className="mt-8 border-t pt-6">
          <div className="text-sm font-medium">[FULL NAME]</div>
          <div className="text-xs text-muted-foreground">
            [ROLE] \u00b7 [CFS / 3PL COMPANY NAME]
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
            TradeOps is the operational and customs ledger. It reads from your
            WMS, TOS, gate systems, and client order feeds, and maintains the
            per-client accounting and customs records that none of them are
            designed to produce.
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
          Bring your messiest month-end.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-pretty text-muted-foreground">
          We will run a real month of your operations through TradeOps \u2014
          receiving, storage, value-added, picking, gate-out, billing \u2014
          and show you what the client invoices and the bonded balance look
          like at the end.
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
      audienceType: 'Container Freight Station and third-party logistics operators',
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