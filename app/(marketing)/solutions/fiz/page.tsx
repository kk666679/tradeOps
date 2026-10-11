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
 *   1. Replace the TESTIMONIAL with a real quote from a FIZ operator who has
 *      approved the attribution. Do not invent a name or a title.
 *
 *   2. Replace the OUTCOMES metrics with numbers drawn from a real
 *      deployment. Do not publish a metric you cannot substantiate.
 *
 *   3. Replace the INTEGRATIONS with the ERP, MES, and PLM systems you
 *      actually support. Do not list an integration you do not have.
 *
 *   4. Confirm any quoted improvement percentage is drawn from a real
 *      engagement and the customer has approved its use.
 *
 * If you have no FIZ operators as customers yet, remove the testimonial and
 * outcomes sections and ship the page with the capabilities and workflow
 * sections only.
 * ============================================================================
 */

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

const BASE_URL = 'https://tradeops.example';
const PAGE_URL = `${BASE_URL}/solutions/fiz`;
const PAGE_TITLE = 'TradeOps for Free Industrial Zones';
const PAGE_DESCRIPTION =
  'Duty-suspended raw materials, production-loss tracking, scrap control, ' +
  'and finished-goods declaration for manufacturers operating in a Free ' +
  'Industrial Zone. Material traceability from receipt to re-export.';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    'Free Industrial Zone',
    'FIZ manufacturing',
    'duty suspension',
    'raw material traceability',
    'production loss tracking',
    'scrap control',
    'customs manufacturing',
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

function BoxesIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-4.03-2.42a2 2 0 0 1-.97-1.71V6.13a2 2 0 0 0-.97-1.71l-1.06-.64a2 2 0 0 0-2.06 0l-1.94 1.16Z" />
      <path d="m7 16.5-4.74-2.85" />
      <path d="m7.5 16.5 5-3" />
      <path d="M12 13.5V19l3.03 1.79a2 2 0 0 0 2.06 0l3-1.8A2 2 0 0 0 21 17.27v-3.24a2 2 0 0 0-.97-1.71L19 11.68" />
      <path d="m17 16.5 4.74-2.85" />
      <path d="m16.5 16.5-5-3" />
      <path d="M12 5.5 8.5 7.5M12 5.5l3.5 2M12 5.5V2" />
    </svg>
  );
}

function WorkflowIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="15" y="15" width="6" height="6" rx="1" />
      <path d="M9 6h6a3 3 0 0 1 3 3v6" />
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

function RecycleIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
      <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12" />
      <path d="m14 16-3 3 3 3" />
      <path d="M8.293 13.596 7.196 9.5 3.1 10.598" />
      <path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843" />
      <path d="m13.378 9.633 4.096 1.098 1.097-4.096" />
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
// Pain points — what actually goes wrong for a FIZ manufacturer
// ---------------------------------------------------------------------------

const PAIN_POINTS: readonly PainPoint[] = [
  {
    id: 'yield',
    problem: 'You cannot prove where every gram of duty-suspended material went.',
    reality:
      'Raw materials enter the zone duty-free. They enter production. Some become finished goods, some become scrap, some become waste, some are lost to evaporation, spillage, or process inefficiency. Customs wants an accounting for all four. Your MRP system tracks production yield for costing purposes; it does not track it for customs purposes.',
    cost:
      'At audit, the difference between what came in and what went out becomes a duty liability — plus penalties, on the assumption that the missing material was consumed domestically.',
  },
  {
    id: 'bom',
    problem: 'Bill-of-materials changes silently invalidate your prior declarations.',
    reality:
      'Engineering changes a component. Sourcing substitutes a supplier. A design revision swaps a sub-assembly. Each change ripples into the HS classification of the finished good, the origin determination, and the applicable preferential rate. Without a link between the BOM version and the declaration, you cannot prove which version was declared for which shipment.',
    cost:
      'A retroactive audit that asks "what was in this product in Q3 last year?" cannot be answered from a system that only stores the current BOM.',
  },
  {
    id: 'scrap',
    problem: 'Scrap and waste disposal is a customs event, not a facilities one.',
    reality:
      'Offcuts, defective parts, rejected sub-assemblies, and process waste all represent duty-suspended material that did not become an exported finished good. Selling scrap to a domestic recycler, disposing of it, or re-exporting it are three different customs treatments, each requiring its own declaration and its own evidence.',
    cost:
      'Silent duty liability accumulating in a scrap yard, invisible until the next audit surfaces it.',
  },
  {
    id: 'subcontract',
    problem: 'Subcontracting out and back is where the paper trail breaks.',
    reality:
      'You send raw material to a subcontractor for a process step — heat treatment, plating, coating, assembly. The material leaves the zone. Under the right conditions, duty suspension continues. Under the wrong conditions, it becomes a taxable removal. The difference is documentation, and the documentation depends on the process.',
    cost:
      'Material removed under the wrong regime, discovered at audit, converted to a duty liability with penalties.',
  },
  {
    id: 'domestic-sale',
    problem: 'Selling into the domestic market triggers duty on the full finished good.',
    reality:
      'When finished goods leave the zone for domestic consumption, duty becomes payable on the full value of the finished good — not on the raw materials that went into it. Determining that value correctly, with the right basis and the right supporting documents, is a per-shipment calculation that errors compound.',
    cost:
      'Under-declaration at the point of sale, discovered at audit, with penalties calculated against the difference.',
  },
];

// ---------------------------------------------------------------------------
// Capabilities — how TradeOps addresses each
// ---------------------------------------------------------------------------

const CAPABILITIES: readonly Capability[] = [
  {
    id: 'material-balance',
    title: 'Material balance accounting',
    description:
      'A duty-suspension ledger that tracks every gram of raw material from receipt through production to finished goods, scrap, waste, and re-export. Reconciled continuously, not at year-end.',
    features: [
      'Receipt-to-consumption traceability',
      'Production-loss recording at the operation level',
      'Scrap, waste, and by-product routing',
      'Continuous balance with drill-down to the source document',
    ],
    icon: <ScaleIcon className="h-5 w-5" />,
  },
  {
    id: 'bom-versioning',
    title: 'BOM version control',
    description:
      'Every declaration is linked to the BOM version that produced the goods. Engineering changes are tracked, and the customs impact of each change is evaluated before the change is approved.',
    features: [
      'BOM version linked to declaration',
      'Engineering change custom-impact review',
      'Substitution tracking with customs approval',
      'Historical BOM retrieval for audit queries',
    ],
    icon: <WorkflowIcon className="h-5 w-5" />,
  },
  {
    id: 'scrap-waste',
    title: 'Scrap and waste disposal control',
    description:
      'Every disposal, sale, or re-export of production residue is a customs event with its own declaration. TradeOps routes each disposal through the correct regime and produces the evidence required.',
    features: [
      'Disposal routing by destination (sale, re-export, destroy)',
      'Scrap duty calculation on disposal',
      'Recycler and disposal contractor documentation',
      'Waste-to-finished-goods ratio monitoring',
    ],
    icon: <RecycleIcon className="h-5 w-5" />,
  },
  {
    id: 'subcontracting',
    title: 'Subcontracting movement control',
    description:
      'Material moved out for processing and returned is tracked against the specific customs regime that applies. Gate passes, outbound declarations, and return reconciliation.',
    features: [
      'Outbound subcontracting declaration',
      'Return reconciliation against outbound',
      'Regime selection with conditional logic',
      'Subcontractor compliance tracking',
    ],
    icon: <BoxesIcon className="h-5 w-5" />,
  },
  {
    id: 'finished-goods',
    title: 'Finished-goods declaration',
    description:
      'When goods leave the zone, the customs treatment is resolved against the current tariff and the specific origin rule for that product. The declaration carries the full provenance chain.',
    features: [
      'Re-export vs. domestic clearance routing',
      'FTA and RCEP origin resolution',
      'Finished-goods valuation with BOM provenance',
      'Declaration preparation with agent assistance',
    ],
    icon: <FileCheckIcon className="h-5 w-5" />,
  },
  {
    id: 'audit',
    title: 'Customs audit readiness',
    description:
      'Every movement, adjustment, and disposal is recorded in an append-only log. When customs comes, the file assembles itself from the transaction history.',
    features: [
      'Append-only audit log enforced at the database',
      'Customs audit pack generation on demand',
      'Historical query support (what was in this product on this date?)',
      'Evidence chain from raw material to finished good',
    ],
    icon: <ShieldCheckIcon className="h-5 w-5" />,
  },
];

// ---------------------------------------------------------------------------
// Workflow — the manufacturing lifecycle inside a FIZ
// ---------------------------------------------------------------------------

const WORKFLOW: readonly WorkflowStep[] = [
  {
    number: '01',
    title: 'Raw material receipt',
    description:
      'Duty-suspended material enters the zone. The inbound declaration is validated, the quantity is recorded against the applicable customs regime, and the material is assigned to a bonded inventory location.',
    outcome: 'Duty suspension starts with a documented baseline.',
  },
  {
    number: '02',
    title: 'Production issue',
    description:
      'Material is issued to a work order. The BOM version is captured. The production-loss allowance for each operation is applied, and the expected output is calculated against the standard yield.',
    outcome:
      'Every issue is linked to a BOM version and an expected output.',
  },
  {
    number: '03',
    title: 'Production completion',
    description:
      'Actual output is recorded. Variances from the standard yield are explained at the operation level — process loss, rejection, evaporation, sampling. Each variance is classified for customs purposes.',
    outcome:
      'Yield variance is explained and classified, not absorbed silently.',
  },
  {
    number: '04',
    title: 'Residue handling',
    description:
      'Scrap, waste, and by-products are routed to their customs treatment: re-export, destruction, sale to a domestic recycler, or return to bonded stock. Each route produces its own declaration and evidence.',
    outcome:
      'No residue leaves the zone without a customs record.',
  },
  {
    number: '05',
    title: 'Subcontracting movement',
    description:
      'Material sent out for processing is tracked against the applicable regime. Return quantities are reconciled against outbound, and any loss in transit or processing is declared.',
    outcome:
      'Duty suspension continues or ends, but always with documentation.',
  },
  {
    number: '06',
    title: 'Finished-goods completion',
    description:
      'Finished goods are added to bonded stock with their full provenance: which BOM version, which raw material lots, which production date, which yield. This chain is what makes an audit defensible.',
    outcome:
      'Every finished good carries a provable history from raw material.',
  },
  {
    number: '07',
    title: 'Outbound declaration',
    description:
      'Finished goods leave the zone for re-export or domestic clearance. The correct regime is applied, the rate is resolved against the current tariff, and the declaration is prepared with the provenance chain attached.',
    outcome:
      'Duty payable is calculated against the correct basis, with evidence.',
  },
];

// ---------------------------------------------------------------------------
// Outcomes
// ---------------------------------------------------------------------------

const OUTCOMES: readonly Outcome[] = [
  {
    value: '[VALUE]',
    label: 'Reduction in audit preparation time',
    context: 'Audit pack generated from the transaction history, not rebuilt',
  },
  {
    value: '[VALUE]',
    label: 'Material balance variance',
    context: 'Receipt-to-export reconciliation in real time',
  },
  {
    value: '[VALUE]',
    label: 'Reduction in duty exposure',
    context: 'Residue and yield variances classified and declared',
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
    category: 'ERP',
    systems: [
      'SAP',
      'Oracle',
      'Microsoft Dynamics 365',
      'NetSuite',
      'Infor',
    ],
    note: 'Order, inventory, and costing integration. The ERP remains the system of record for commercial data; TradeOps owns the customs ledger.',
  },
  {
    category: 'MES and production',
    systems: [
      'SAP ME/MII',
      'Siemens Opcenter',
      'Rockwell FactoryTalk',
      'Custom SCADA and shop-floor systems',
    ],
    note: 'Production completions, operation-level loss, and yield data feed the material balance in near real time.',
  },
  {
    category: 'PLM and engineering',
    systems: [
      'Siemens Teamcenter',
      'PTC Windchill',
      'Dassault ENOVIA',
      'Custom BOM management',
    ],
    note: 'BOM versions and engineering changes flow through a customs-impact review before they are released to production.',
  },
  {
    category: 'Customs and government',
    systems: [
      'JKDM declaration systems (Malaysia)',
      'Free Zone authority systems',
      'MITI licensing systems',
      'Broker EDI connections',
    ],
    note: 'Declaration preparation and submission integration, with the customs authority as the authoritative destination.',
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
          Solutions · Free Industrial Zone
        </div>

        <h1 className="mt-6 max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Every gram accounted for.
        </h1>

        <p className="mt-5 max-w-2xl text-pretty text-lg text-muted-foreground">
          TradeOps runs the customs ledger for manufacturers inside a Free
          Industrial Zone — tracking duty-suspended raw materials through
          production, explaining every yield variance, and producing the
          audit pack when customs asks.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            See it on your production line
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
          A FIZ manufacturer's customs problem is not a warehousing problem.
          It is a manufacturing problem: raw materials are physically
          transformed, and customs wants the accounting for the
          transformation, not just the receipt and the shipment.
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
            a manufacturer inside a Free Industrial Zone.
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
          From raw material to re-export.
        </h2>
        <p className="mt-3 text-muted-foreground">
          Seven stages covering the full customs lifecycle of duty-suspended
          material inside a Free Industrial Zone. Every stage produces a
          record that customs can trace.
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
        What FIZ operators say
      </h2>

      <figure className="rounded-2xl border bg-background p-8 sm:p-10">
        <QuoteIcon className="h-8 w-8 text-muted-foreground/30" />
        <blockquote className="mt-6 text-pretty text-lg leading-relaxed text-foreground/90 sm:text-xl">
          Customs asked for a material balance on a product line we had
          changed three times in two years. We opened TradeOps, filtered to
          the product family, and exported the balance with the BOM version
          attached to each period. What used to take my team a month of
          spreadsheet archaeology took an afternoon.
        </blockquote>
        <figcaption className="mt-8 border-t pt-6">
          <div className="text-sm font-medium">[FULL NAME]</div>
          <div className="text-xs text-muted-foreground">
            [ROLE] · [MANUFACTURER NAME]
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
            TradeOps is the customs ledger. It does not replace your ERP, your
            MES, or your PLM system. It reads from them and maintains the
            duty-suspension accounting that none of them are designed to
            produce.
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
          Bring your hardest product line.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-pretty text-muted-foreground">
          We will walk it through the full customs lifecycle — raw material
          receipt, production consumption, yield variance, residue handling,
          finished-goods declaration — and show you the material balance at
          the end.
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
      audienceType: 'Free Industrial Zone manufacturers',
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