import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { PageHero } from '@/components/marketing/shared/PageHero';
import { SectionHeading } from '@/components/marketing/shared/SectionHeading';
import { FeatureCard } from '@/components/marketing/features/FeatureCard';
import { StatGrid } from '@/components/marketing/shared/StatGrid';
import { AgentRoster } from '@/components/marketing/shared/AgentRoster';
import { TrustGrid } from '@/components/marketing/shared/TrustGrid';
import { IntegrationGrid } from '@/components/marketing/shared/IntegrationGrid';
import { CapabilityMatrix } from '@/components/marketing/shared/CapabilityMatrix';
import { zoneChip } from '@/components/marketing/shared/tone';
import { PricingTable } from '@/components/marketing/pricing/PricingTable';
import { FAQ } from '@/components/marketing/faq/FAQ';
import { CTABand } from '@/components/marketing/shared/CTABand';
import { LiveAgentDemo } from '@/components/marketing/shared/LiveAgentDemo';
import { UseCases } from '@/components/marketing/use-cases/UseCases';
import { Testimonials } from '@/components/marketing/testimonials/Testimonials';
import { BondedWorkflowExplorer } from '@/components/fiz-fcz/workflow/BondedWorkflowExplorer';

export const metadata: Metadata = {
  title: 'TradeOps · FIZ/FCZ — The autonomous TradeOps layer for Free Zones',
  description:
    'TradeOps, bonded WMS, order management, digital twin, and 7 customs agents — one platform for Free Industrial Zones and Free Commercial Zones.',
  keywords: [
    'FIZ', 'FCZ', 'Free Industrial Zone', 'Free Commercial Zone',
    'customs agents', 'trade ops', 'HS classification', 'bonded warehouse',
    'ATIGA', 'RCEP', 'ASYCUDA', 'MYPKG',
  ],
  openGraph: {
    title: 'CFS · FIZ/FCZ — Autonomous TradeOps for Free Zones',
    description: 'Declarations, HS, valuation, origin, screening, drawback — run end-to-end by 7 customs agents.',
    type: 'website',
  },
};

/* ═══════════════════════════════════════════════════════════════════
   Local data
   ═══════════════════════════════════════════════════════════════════ */

const PRODUCTS = [
  { title: 'Trade OPS',         href: '/product/trade-ops',         body: 'Declarations, HS, valuation, origin, permits, clearance, compliance, drawback.', tone: 'sky'    as const },
  { title: 'WMS · FIZ',         href: '/product/wms-fiz',           body: 'Raw material, machinery, production input, BOM, wastage, subcontract, finished goods.', tone: 'sky' as const },
  { title: 'WMS · FCZ',         href: '/product/wms-fcz',           body: 'Transhipment, re-export, break-bulk, repacking, entrepot, value-add, trading houses.', tone: 'amber' as const },
  { title: 'Order Management',  href: '/product/order-management',  body: 'Purchase, manufacturing, trading, transhipment, fulfilment — with customs attached to every order.', tone: 'sky' as const },
  { title: 'Digital Twin',      href: '/product/digital-twin',      body: 'Zone graph, scenario builder, what-if analysis, live metrics, bottleneck Pareto.', tone: 'violet' as const },
  { title: 'Custom Agents',     href: '/product/custom-agents',     body: '7-agent mesh. Registry, builder, orchestration, supervision, policy, monitoring, audit, memory, evals.', tone: 'violet' as const },
];

const VALUE_PROPS = [
  {
    title: 'Traceability',
    body: 'Connected operational events — from the first duty-suspended receipt to the closed period.',
  },
  {
    title: 'Control',
    body: 'Exceptions and evidence. A hold carries the documents it was raised on.',
  },
  {
    title: 'Reconciliation',
    body: 'Duty close-out as a workflow: what entered, was consumed, was excised, and left must agree.',
  },
  {
    title: 'Agent orchestration',
    body: 'One primary agent owns each event; supporting agents observe the whole chain.',
  },
];

const QUOTES = [
  { quote: 'Declaration prep dropped by 70%. The Customs Agent knows our FIZ scheme and our HS history.', author: 'Head of Customs', org: 'FIZ Electronics Park' },
  { quote: 'Transhipment finally has an end-to-end ledger. Duty-suspension visibility is a game changer.', author: 'COO', org: 'FCZ Transhipment Hub' },
  { quote: 'The digital twin let us simulate gate congestion before peak season. No surprises.', author: 'Ops Director', org: 'Bonded CFS' },
  { quote: 'Agent approvals flow into our audit trail. Customs is happy. We are happy.', author: 'Compliance Lead', org: 'Multinational 3PL' },
];

const FAQ_ITEMS = [
  { q: 'Is this built for FIZ, FCZ, or both?', a: 'Both. FIZ ships with manufacturing semantics — raw material, machinery, BOM, production input, wastage, subcontract. FCZ ships with trading semantics — transhipment, re-export, break-bulk, repacking, entrepot.' },
  { q: 'How does duty suspension work?', a: 'Every inbound, movement, and outbound is checked against the zone scheme. The bonded ledger reconciles, aging reports surface expiring exemptions, and clawback is automated.' },
  { q: 'Can I run customs agents safely?', a: 'Agents execute only through RBAC-gated tRPC procedures. Approvals route through the human-in-the-loop gate. Every action lands on the hash-chained audit trail.' },
  { q: 'What integrations ship out of the box?', a: 'Customs gateway, ASYCUDA World, ATIGA, RCEP rule packs, ERP / TMS / WMS bridges, webhooks, and an agent mesh. All bridges are first-party.' },
  { q: 'Where do the rule packs come from?', a: 'Production-grade compliance rule packs covering MY Customs Act 1967, Sales Tax 2018, FIZ/FCZ regulations, Bonded Warehouse rules, ASEAN ATIGA, RCEP origin, and WCO HS 2022.' },
  { q: 'Is multi-tenant isolation enforced?', a: 'Every query is scoped by tenantId at the Prisma layer. Tenants can run pooled, siloed, or on dedicated data planes — with the same guarantees.' },
  { q: 'Can I bring my own LLM?', a: 'Yes on Enterprise. Point to any OpenAI-compatible endpoint, or run a local model. Agents continue to work with the same guardrails and audit spine.' },
];

/* ═══════════════════════════════════════════════════════════════════
   Small inline bits (kept in-file to avoid over-splitting)
   ═══════════════════════════════════════════════════════════════════ */

function HeroDashboard() {
  const rows = [
    'Document · extract',
    'HS · classify 8471.30.10',
    'Valuation · transaction',
    'Origin · RCEP (0.93)',
    'Screening · clear',
    'Customs · filing draft',
    'Risk · review',
  ];
  return (
    <div className="w-full max-w-md rounded-2xl border bg-gradient-to-br from-fiz/10 via-card to-fcz/10 p-4 shadow-sm">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-clear-500" />
          agent-mesh · live
        </span>
        <span className={zoneChip('FIZ')}>FIZ</span>
      </div>
      <ul className="mt-3 space-y-2 text-xs">
        {rows.map((row) => (
          <li key={row} className="flex items-center gap-2 rounded border bg-card px-3 py-1.5 font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-clear-500" />
            {row}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Page
   ═══════════════════════════════════════════════════════════════════ */

export default function HomePage() {
  return (
    <>
      {/* ───────────────────────────── HERO ───────────────────────────── */}
      <PageHero
        eyebrow="7 customs agents · live · MY Customs Act 1967 · ATIGA · RCEP"
        title="The autonomous TradeOps layer for FIZ and FCZ."
        subtitle="Automate declarations, HS classification, valuation, origin checks, and screening end-to-end. Powered by an AI agent mesh with human-in-the-loop oversight and a fully immutable audit chain."
        primary={{ label: 'Explore the workflow', href: '/workflow' }}
        secondary={{ label: 'See how it works', href: '#live-demo' }}
      >
        <div className="flex items-center justify-center">
          <HeroDashboard />
        </div>
      </PageHero>

      {/* ───────────────────────────── HERO STATS ───────────────────────────── */}
      <section className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <StatGrid
            items={[
              { label: 'Declarations / mo', value: '120k' },
              { label: 'Duty recovered',     value: 'MYR 41M', hint: 'Through missed-exemption discovery and HS reclassification' },
              { label: 'Agent actions',      value: '2.1M' },
              { label: 'Uptime',             value: '99.98%' },
            ]}
          />
        </div>
      </section>

      {/* ───────────────────────────── LIVE AGENT DEMO ───────────────────────────── */}
      <section id="live-demo" className="border-b bg-muted/60">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <SectionHeading
            eyebrow="Live"
            title="Watch a Customs Agent file a declaration"
            subtitle="Simulated · 7 agents · real-world rule packs (MY Customs Act, ATIGA, RCEP, WCO HS 2022) · nothing leaves your browser."
          />
          <LiveAgentDemo zone="FIZ" />
          <p className="mt-6 text-xs text-muted-foreground">
            The demo is a faithful replay of the production agent loop. Sign in to file on your own data.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-clear-300 bg-clear-500/10 px-3 py-1 text-xs font-medium text-clear-600">
            <span className="h-1.5 w-1.5 rounded-full bg-clear-500" />
            100% client-side simulation · nothing leaves your browser
          </div>
        </div>
      </section>

      {/* ───────────────────────────── INTERACTIVE WORKFLOW PREVIEW ───────────────────────────── */}
      <section id="workflow-demo" className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <SectionHeading
            eyebrow="Interactive demo"
            title="The bonded workflow, end to end"
            subtitle="FIZ production inputs → bonded transfer → FCZ commercial flows → duty reconciliation → audit close. Click any step for its event id, owning agent, and neighbours."
          />
          <BondedWorkflowExplorer variant="preview" />
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {VALUE_PROPS.map((prop) => (
              <div key={prop.title} className="rounded-xl border bg-card p-4">
                <div className="text-sm font-medium">{prop.title}</div>
                <p className="mt-1 text-xs text-muted-foreground">{prop.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/workflow"
              className="rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:bg-foreground/80"
            >
              Open the full workflow explorer →
            </Link>
            <Link href="/demo" className="text-sm text-primary hover:underline">
              Book a walkthrough
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────────────────────── PRODUCT GRID ───────────────────────────── */}
      <section id="product" className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <SectionHeading
            eyebrow="Product"
            title="Six modules, one substrate"
            subtitle="Trade OPS, WMS (FIZ + FCZ), orders, digital twin, and custom agents — sharing the same tenancy, RBAC, guardrails, and audit spine."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((p) => (
              <FeatureCard key={p.title} {...p} />
            ))}
          </div>
          <div className="mt-8">
            <Link href="/product" className="text-sm text-primary hover:underline">
              See all product pages →
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────────────────────── USE CASES ───────────────────────────── */}
      <UseCases />

      {/* ───────────────────────────── AGENT ROSTER ───────────────────────────── */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <SectionHeading
            eyebrow="Agents"
            title="A mesh of 7 agents — each with guardrails"
            subtitle="Declared in .autoclaw/agents/*.agent.yaml, bound to RBAC-gated tRPC procedures, monitored end-to-end."
          />
          <AgentRoster />
          <div className="mt-8">
            <Link href="/product/custom-agents" className="text-sm text-primary hover:underline">
              Explore the agent mesh →
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────────────────────── CAPABILITY MATRIX ───────────────────────────── */}
      <section className="border-b bg-muted/60">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <SectionHeading
            eyebrow="Capabilities"
            title="Everything you need — in one platform"
            subtitle="Trade OPS · WMS · Orders · Digital twin · Custom agents · Integrations."
          />
          <CapabilityMatrix />
        </div>
      </section>

      {/* ───────────────────────────── TRUST ───────────────────────────── */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <SectionHeading
            eyebrow="Trust"
            title="Built to be audited, not trusted blindly"
            subtitle="Every agent action is bounded by policy, gated by a human, and recorded on a hash chain."
          />
          <TrustGrid />
          <div className="mt-8">
            <Link href="/security" className="text-sm text-primary hover:underline">
              Security and compliance →
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────────────────────── INTEGRATIONS ───────────────────────────── */}
      <section className="border-b bg-muted/60">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <SectionHeading
            eyebrow="Integrations"
            title="Plugs into what you already run"
            subtitle="First-party bridges for customs and free-zone operations, plus a webhook + agent-mesh fabric."
          />
          <IntegrationGrid />
        </div>
      </section>

      {/* ───────────────────────────── TESTIMONIALS ───────────────────────────── */}
      <Testimonials
        title="Operators ship more with CFS FIZ/FCZ"
        subtitle="From single-zone FIZ manufacturers to national operator networks."
        items={QUOTES.map((quote, index) => ({ ...quote, id: `quote-${index + 1}` }))}
      >
        <div className="mt-8">
          <Link href="/customers" className="text-sm text-primary hover:underline">
            Read case studies →
          </Link>
        </div>
      </Testimonials>

      {/* ───────────────────────────── PRICING ───────────────────────────── */}
      <section className="border-b bg-muted/60">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <SectionHeading
            eyebrow="Pricing"
            title="Pricing for every FIZ / FCZ footprint"
            subtitle="Single zone to national operator network. Switch between FIZ and FCZ to see the plan differences."
            align="center"
          />
          <PricingTable defaultZone="FIZ" />
          <p className="mt-6 text-center text-xs text-muted-foreground">
            All plans include multi-tenant isolation, RBAC + ABAC, hash-chained audit, HITL approvals, guardrails, and jurisdiction rule packs.
          </p>
          <div className="mt-6 text-center">
            <Link href="/pricing" className="text-sm text-primary hover:underline">
              Full pricing and comparison →
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────────────────────── FAQ ───────────────────────────── */}
      <FAQ items={FAQ_ITEMS} title="Frequently asked" />

      {/* ───────────────────────────── CTA ───────────────────────────── */}
      <CTABand
        title="Ready to run your FIZ / FCZ on one platform?"
        subtitle="Bring your zone topology — we will map it live in 30 minutes."
        primary={{ label: 'Explore the workflow', href: '/workflow' }}
        secondary={{ label: 'Book a walkthrough', href: '/demo' }}
      />
    </>
  );
}