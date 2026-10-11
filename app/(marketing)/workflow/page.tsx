import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { PageHero } from '@/components/marketing/shared/PageHero';
import { SectionHeading } from '@/components/marketing/shared/SectionHeading';
import { CTABand } from '@/components/marketing/shared/CTABand';
import { BondedWorkflowExplorer } from '@/components/fiz-fcz/workflow/BondedWorkflowExplorer';
import { BondedEventTimeline } from '@/components/fiz-fcz/workflow/BondedEventTimeline';
import { BondedLedgerEventInspector } from '@/components/fiz-fcz/workflow/BondedLedgerEventInspector';
import { ExceptionPathSummary } from '@/components/fiz-fcz/workflow/ExceptionPathSummary';
import { AgentOrchestrationMatrix } from '@/components/fiz-fcz/workflow/AgentOrchestrationMatrix';
import { AgentDirectory } from '@/components/fiz-fcz/workflow/AgentDirectory';

export const metadata: Metadata = {
  title: 'The bonded workflow — FIZ to FCZ to close-out',
  description:
    'Explore the end-to-end bonded workflow: FIZ production inputs, bonded transfer, FCZ commercial flows, duty reconciliation, and audit close. Every step is an event on the bonded ledger.',
};

/* ═══════════════════════════════════════════════════════════════════
   Local data
   ═══════════════════════════════════════════════════════════════════ */

const PHASES = [
  {
    zone: 'FIZ',
    title: 'Free Industrial Zone',
    body: 'Raw material and machinery enter under duty suspension. Production consumes against the BOM, wastage is reason-coded and excised, and finished goods are registered against an output HS classification.',
    events: ['fiz.raw.received', 'fiz.production.consumed', 'fiz.fg.produced'],
  },
  {
    zone: 'BRIDGE',
    title: 'Bonded transfer',
    body: 'Finished goods move into the commercial zone under a bonded transfer. Duty stays suspended for the whole leg — nothing enters the customs territory.',
    events: ['zone.transfer.fiz_fcz'],
  },
  {
    zone: 'FCZ',
    title: 'Free Commercial Zone',
    body: 'Inbound receipt, transhipment, break-bulk, repackaging with value-add tracking, and re-export. The import and export pair is what proves duty suspension applied.',
    events: ['fcz.inbound.received', 'fcz.reexport.confirmed', 'fcz.entrepot.matched'],
  },
  {
    zone: 'CLOSE',
    title: 'Control & close-out',
    body: 'Movements are reconciled against the ledger, exceptions are escalated with evidence attached, and the period is locked into an auditable evidence pack.',
    events: ['ledger.duty.reconciled', 'audit.period.closed'],
  },
];

const VALUE_PROPS = [
  {
    title: 'Traceability',
    body: 'Connected operational events — from the first duty-suspended receipt to the closed period, with nothing reconstructed after the fact.',
  },
  {
    title: 'Control',
    body: 'Exceptions and evidence. A hold carries the documents it was raised on, so escalation starts from facts.',
  },
  {
    title: 'Reconciliation',
    body: 'Duty close-out as a workflow: what entered, what was consumed, what was excised, and what left must agree.',
  },
  {
    title: 'Agent orchestration',
    body: 'One primary agent owns each event; supporting agents observe the whole chain and escalate the exceptions.',
  },
];

export default function WorkflowPage() {
  return (
    <>
      <PageHero
        compact
        eyebrow="Workflow explorer"
        title="One connected bonded workflow"
        subtitle="FIZ production, bonded transfer, FCZ commercial flows, duty reconciliation, and audit close — every step is an explicit event on the bonded ledger. Click any step for its event id, owning agent, and neighbours."
        primary={{ label: 'Book a walkthrough', href: '/demo' }}
        secondary={{ label: 'Read the docs', href: '/docs' }}
      />

      {/* ───────────────────────────── EXPLORER ───────────────────────────── */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <SectionHeading
            eyebrow="Interactive"
            title="The complete workflow, end to end"
            subtitle="Drag to pan, scroll to zoom, or switch to the step list. Toggle agent links to see which agent owns which event."
          />
          <BondedWorkflowExplorer variant="full" showOverlays={false} />
          <p className="mt-3 text-xs text-muted-foreground">
            The in-app view adds the platform map — module, persona, and digital-twin context around
            the same workflow.{' '}
            <Link href="/bonded-workflow" className="text-primary hover:underline">
              Open the app view →
            </Link>
          </p>
        </div>
      </section>

      {/* ───────────────────────────── PHASES ───────────────────────────── */}
      <section className="border-b bg-muted/60">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <SectionHeading
            eyebrow="How it fits together"
            title="Four phases, one ledger"
            subtitle="The workflow reads left to right: industrial production feeds a bonded transfer, commercial flows carry the goods out, and control closes the period."
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {PHASES.map((phase) => (
              <div key={phase.zone} className="rounded-xl border border-border bg-card p-4">
                <span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                  {phase.zone}
                </span>
                <h3 className="mt-2 text-sm font-semibold text-foreground">{phase.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{phase.body}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {phase.events.map((event) => (
                    <code key={event} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-foreground">
                      {event}
                    </code>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────────── VALUE PROPS ───────────────────────────── */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <SectionHeading
            eyebrow="Why it matters"
            title="What the workflow gives you"
            subtitle="The same model that draws the diagram is what the platform enforces."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VALUE_PROPS.map((prop) => (
              <div key={prop.title} className="rounded-xl border border-border bg-card p-4">
                <h3 className="text-sm font-semibold text-foreground">{prop.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{prop.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────────── INSIGHTS ───────────────────────────── */}
      <section className="border-b bg-muted/60">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <SectionHeading
            eyebrow="Product depth"
            title="Events, exceptions, and agents"
            subtitle="The same workflow seen as a timeline, a hash-chained audit trail, exception paths, and the agent orchestration behind each step. Sample values are illustrative, not live operations."
          />

          <div className="grid gap-4 lg:grid-cols-2">
            <BondedEventTimeline />
            <BondedLedgerEventInspector />
          </div>

          <div className="mt-4">
            <ExceptionPathSummary />
          </div>

          <div className="mt-4">
            <AgentOrchestrationMatrix />
          </div>

          <div className="mt-4">
            <AgentDirectory />
          </div>
        </div>
      </section>

      <CTABand
        title="See it against your own zone topology"
        subtitle="Bring your flow — we will map it live in 30 minutes."
        primary={{ label: 'Book a walkthrough', href: '/demo' }}
        secondary={{ label: 'Back to overview', href: '/' }}
      />
    </>
  );
}
