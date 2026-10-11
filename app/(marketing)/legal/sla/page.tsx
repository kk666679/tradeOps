import * as React from 'react';
import type { Metadata } from 'next';

/**
 * ============================================================================
 * TEMPLATE — NOT LEGAL ADVICE
 * ============================================================================
 *
 * This file is a structural template for a Service Level Agreement page. It
 * is not a substitute for legal review. Before publishing:
 *
 *   1. Have a qualified lawyer in your jurisdiction review every section.
 *   2. Replace all [BRACKETED PLACEHOLDERS] with your actual commitments.
 *   3. Confirm the uptime target is achievable with your current
 *      architecture and vendors. A commitment you cannot keep is a
 *      liability, not a marketing asset.
 *   4. Confirm the service credit schedule is enforceable where you operate.
 *   5. Confirm the measurement methodology matches what your monitoring
 *      actually measures. Do not promise a metric you cannot substantiate.
 *   6. If your SLAs vary per customer, this page should describe the
 *      default and refer to the customer's order form for the specific
 *      commitment. Do not contradict the contract.
 *
 * An SLA is a contractual commitment with financial consequences. Shipping
 * one you cannot meet exposes you to service credit claims and, in some
 * jurisdictions, regulatory scrutiny.
 *
 * The numbers below (99.9% uptime, 15-minute P1 response, credit tiers) are
 * industry-typical defaults for a business-critical SaaS platform. They are
 * not recommendations. Replace them with commitments that fit your
 * architecture, your staffing model, and your commercial position.
 * ============================================================================
 */

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

const BASE_URL = 'https://tradeops.example';
const PAGE_URL = `${BASE_URL}/legal/sla`;
const PAGE_TITLE = 'Service Level Agreement';
const PAGE_DESCRIPTION =
  'Uptime, support, incident response, and service credit commitments for ' +
  'the TradeOps platform.';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const dynamic = 'force-static';

// ---------------------------------------------------------------------------
// Document constants
// ---------------------------------------------------------------------------

const SLA_VERSION = '1.0.0';
const EFFECTIVE_DATE = '2026-01-01';
const LAST_UPDATED = '2026-10-10';
const COMPANY = {
  legalName: '[COMPANY LEGAL NAME]',
  country: 'Malaysia',
};
const UPTIME_TARGET = '99.9%';
const SUPPORT_EMAIL = 'support@tradeops.example';
const STATUS_URL = 'https://status.tradeops.example';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Severity = {
  id: 'p1' | 'p2' | 'p3' | 'p4';
  label: string;
  short: string;
  description: string;
  examples: string[];
  tone: 'critical' | 'high' | 'medium' | 'low';
};

type Credit = {
  uptimeRange: string;
  credit: string;
};

type Section = {
  id: string;
  number: string;
  title: string;
  body: React.ReactNode;
};

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const SEVERITIES: readonly Severity[] = [
  {
    id: 'p1',
    label: 'Priority 1 — Critical',
    short: 'P1',
    description:
      'The Service is unavailable or materially degraded for all users of ' +
      'a tenant, and no workaround is available. Business operations that ' +
      'depend on the Service cannot proceed.',
    examples: [
      'Platform-wide outage — login, API, or UI unreachable',
      'Declaration filing fails for every customer',
      'Data loss or corruption affecting customer records',
      'Security incident involving unauthorised access to Customer Data',
    ],
    tone: 'critical',
  },
  {
    id: 'p2',
    label: 'Priority 2 — High',
    short: 'P2',
    description:
      'A major function is unavailable or materially degraded. A workaround ' +
      'may exist but is operationally painful or carries material risk of ' +
      'error.',
    examples: [
      'Agent orchestration down — approvals not routing',
      'Bonded ledger not updating after gate events',
      'Bulk import or export failing',
      'A single integration down (ERP, carrier, customs API)',
    ],
    tone: 'high',
  },
  {
    id: 'p3',
    label: 'Priority 3 — Medium',
    short: 'P3',
    description:
      'A function is impaired but a reasonable workaround exists. The ' +
      'impact is operational inconvenience, not business interruption.',
    examples: [
      'Reporting delayed or slow to load',
      'Search returns incomplete results',
      'Single non-critical integration failing intermittently',
      'Notification delivery delayed',
    ],
    tone: 'medium',
  },
  {
    id: 'p4',
    label: 'Priority 4 — Low',
    short: 'P4',
    description:
      'Cosmetic, minor, or non-blocking issue. Includes feature requests ' +
      'and documentation gaps.',
    examples: [
      'UI inconsistency or layout issue',
      'Typo in the interface',
      'Documentation clarification',
      'Feature enhancement request',
    ],
    tone: 'low',
  },
];

const RESPONSE_TARGETS: readonly {
  severity: string;
  response: string;
  update: string;
  workaround: string;
}[] = [
  {
    severity: 'P1',
    response: '15 minutes, 24 × 7',
    update: 'Every 60 minutes until resolved',
    workaround: '4 hours',
  },
  {
    severity: 'P2',
    response: '1 hour during Business Hours',
    update: 'Every 4 business hours',
    workaround: '8 business hours',
  },
  {
    severity: 'P3',
    response: '4 business hours',
    update: 'Every 2 business days',
    workaround: '5 business days',
  },
  {
    severity: 'P4',
    response: '1 business day',
    update: 'Weekly',
    workaround: 'Next scheduled release',
  },
];

const CREDIT_SCHEDULE: readonly Credit[] = [
  { uptimeRange: 'Less than 99.9% but at least 99.5%', credit: '10%' },
  { uptimeRange: 'Less than 99.5% but at least 99.0%', credit: '25%' },
  { uptimeRange: 'Less than 99.0%', credit: '50%' },
];

const DOWNTIME_EQUIVALENTS: readonly {
  uptime: string;
  monthly: string;
  annual: string;
}[] = [
  { uptime: '99.99%', monthly: '~4.4 minutes', annual: '~52.6 minutes' },
  { uptime: '99.95%', monthly: '~21.9 minutes', annual: '~4.4 hours' },
  { uptime: '99.9%', monthly: '~43.8 minutes', annual: '~8.8 hours' },
  { uptime: '99.5%', monthly: '~3.65 hours', annual: '~1.83 days' },
  { uptime: '99.0%', monthly: '~7.3 hours', annual: '~3.65 days' },
];

// ---------------------------------------------------------------------------
// Tone helpers
// ---------------------------------------------------------------------------

const TONE_CLASSES: Record<Severity['tone'], string> = {
  critical:
    'border-red-500/30 bg-red-500/[0.06] text-red-700 dark:text-red-400',
  high:
    'border-amber-500/30 bg-amber-500/[0.06] text-amber-700 dark:text-amber-400',
  medium:
    'border-blue-500/30 bg-blue-500/[0.06] text-blue-700 dark:text-blue-400',
  low: 'border-slate-400/30 bg-slate-400/[0.06] text-slate-700 dark:text-slate-400',
};

const TONE_DOT: Record<Severity['tone'], string> = {
  critical: 'bg-red-500',
  high: 'bg-amber-500',
  medium: 'bg-blue-500',
  low: 'bg-slate-400',
};

// ---------------------------------------------------------------------------
// Table primitives
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
// Sections
// ---------------------------------------------------------------------------

const SECTIONS: readonly Section[] = [
  {
    id: 'overview',
    number: '1',
    title: 'Overview',
    body: (
      <>
        <p>
          This Service Level Agreement (the &ldquo;SLA&rdquo;) forms part of
          your agreement with {COMPANY.legalName} (&ldquo;TradeOps&rdquo;,
          &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) and
          describes the availability, support, incident response, and service
          credit commitments that apply to the TradeOps platform (the
          &ldquo;Service&rdquo;).
        </p>
        <p>
          This SLA applies to customers on a paid subscription plan. Trial,
          evaluation, and free-tier access is provided without a service
          level commitment. Where your order form contains a different
          commitment, the order form prevails.
        </p>
        <p>
          Capitalised terms not defined in this SLA have the meaning given to
          them in the Terms of Service.
        </p>
      </>
    ),
  },
  {
    id: 'definitions',
    number: '2',
    title: 'Definitions',
    body: (
      <dl className="space-y-3">
        <div>
          <dt className="font-medium text-foreground">
            &ldquo;Available&rdquo;
          </dt>
          <dd className="text-muted-foreground">
            means that the Service is accessible to the customer and its
            Authorised Users and is capable of processing requests within
            normal parameters, as measured by our monitoring systems.
          </dd>
        </div>
        <div>
          <dt className="font-medium text-foreground">
            &ldquo;Business Hours&rdquo;
          </dt>
          <dd className="text-muted-foreground">
            means 09:00 to 18:00 Malaysia Time (MYT, UTC+8), Monday through
            Friday, excluding public holidays in [OPERATING JURISDICTION].
          </dd>
        </div>
        <div>
          <dt className="font-medium text-foreground">
            &ldquo;Downtime&rdquo;
          </dt>
          <dd className="text-muted-foreground">
            means any period during which the Service is not Available, other
            than during Scheduled Maintenance or as a result of an exclusion
            described in Section 10.
          </dd>
        </div>
        <div>
          <dt className="font-medium text-foreground">
            &ldquo;Monthly Uptime Percentage&rdquo;
          </dt>
          <dd className="text-muted-foreground">
            means (total minutes in the calendar month minus Downtime minutes
            in the month) divided by total minutes in the month, expressed as
            a percentage.
          </dd>
        </div>
        <div>
          <dt className="font-medium text-foreground">
            &ldquo;Scheduled Maintenance&rdquo;
          </dt>
          <dd className="text-muted-foreground">
            means maintenance performed during a maintenance window announced
            in advance in accordance with Section 4.
          </dd>
        </div>
        <div>
          <dt className="font-medium text-foreground">
            &ldquo;Service Credit&rdquo;
          </dt>
          <dd className="text-muted-foreground">
            means a credit against future subscription fees, calculated as
            described in Section 9.
          </dd>
        </div>
      </dl>
    ),
  },
  {
    id: 'availability',
    number: '3',
    title: 'Service Availability Commitment',
    body: (
      <>
        <div className="not-prose my-6 rounded-xl border bg-muted/30 p-6">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            Monthly Uptime Commitment
          </div>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-5xl font-semibold tabular-nums tracking-tight">
              {UPTIME_TARGET}
            </span>
            <span className="text-sm text-muted-foreground">
              of the Service, measured monthly
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Excluding Scheduled Maintenance and the exclusions in Section 10.
          </p>
        </div>

        <p>
          We commit to a Monthly Uptime Percentage of at least{' '}
          <strong>{UPTIME_TARGET}</strong> for the core Service. The core
          Service comprises authentication, the web application, and the API
          endpoints documented at [DOCS URL].
        </p>

        <p>
          To put the commitment in context, the following table shows what
          different uptime targets mean in actual downtime.
        </p>

        <Table caption="Uptime targets and their downtime equivalents">
          <thead>
            <tr>
              <Th>Uptime target</Th>
              <Th>Downtime per month</Th>
              <Th>Downtime per year</Th>
            </tr>
          </thead>
          <tbody>
            {DOWNTIME_EQUIVALENTS.map((row) => (
              <tr key={row.uptime}>
                <Td className="font-medium tabular-nums">{row.uptime}</Td>
                <Td className="tabular-nums">{row.monthly}</Td>
                <Td className="tabular-nums">{row.annual}</Td>
              </tr>
            ))}
          </tbody>
        </Table>

        <p>
          Availability is measured at the Service boundary, using external
          synthetic monitoring from at least three geographic locations. It
          is not measured from the customer&rsquo;s network, and it is not
          measured using customer-reported incidents.
        </p>
      </>
    ),
  },
  {
    id: 'maintenance',
    number: '4',
    title: 'Scheduled Maintenance',
    body: (
      <>
        <p>
          We perform Scheduled Maintenance during defined maintenance windows
          to apply security patches, deploy updates, and perform capacity
          work. Scheduled Maintenance does not count toward Downtime.
        </p>
        <p>
          Standard maintenance window: [MAINTENANCE WINDOW — e.g. Sundays,
          02:00 to 06:00 MYT].
        </p>
        <p>
          We will provide at least [NUMBER] days&rsquo; advance notice for
          Scheduled Maintenance that is expected to cause user-visible impact.
          Notice will be provided by email and posted on the status page at{' '}
          <a
            href={STATUS_URL}
            className="underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {STATUS_URL}
          </a>
          .
        </p>
        <p>
          Emergency maintenance required to address a security vulnerability
          or an active incident may be performed without advance notice. Where
          reasonably practicable, we will provide advance notice even for
          emergency maintenance.
        </p>
        <p>
          Total Scheduled Maintenance causing user-visible impact will not
          exceed [NUMBER] hours in any calendar month. Maintenance exceeding
          this limit counts as Downtime for the purposes of this SLA.
        </p>
      </>
    ),
  },
  {
    id: 'support',
    number: '5',
    title: 'Support Hours and Channels',
    body: (
      <>
        <p>
          Support is available through the following channels. Priority 1
          incidents may be reported through any channel and are monitored
          24 × 7.
        </p>

        <Table caption="Support channels and hours">
          <thead>
            <tr>
              <Th>Channel</Th>
              <Th>Availability</Th>
              <Th>Best for</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td className="font-medium">Support portal</Td>
              <Td>24 × 7 (submission)</Td>
              <Td>All incidents; the recommended channel for tracking</Td>
            </tr>
            <tr>
              <Td className="font-medium">
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {SUPPORT_EMAIL}
                </a>
              </Td>
              <Td>24 × 7 (monitored)</Td>
              <Td>P1 and P2 incidents; general enquiries</Td>
            </tr>
            <tr>
              <Td className="font-medium">Emergency hotline</Td>
              <Td>24 × 7</Td>
              <Td>P1 incidents only; number provided at onboarding</Td>
            </tr>
            <tr>
              <Td className="font-medium">Dedicated support manager</Td>
              <Td>Business Hours</Td>
              <Td>Enterprise plans; account and escalation matters</Td>
            </tr>
          </tbody>
        </Table>

        <p>
          Support is provided in English and [OTHER SUPPORTED LANGUAGES].
        </p>
      </>
    ),
  },
  {
    id: 'severity',
    number: '6',
    title: 'Incident Severity Levels',
    body: (
      <>
        <p>
          Incidents are classified by severity at the time of reporting.
          Severity may be revised during the incident lifecycle if the
          impact changes. The final severity determines the applicable
          response and resolution targets.
        </p>

        <div className="mt-6 space-y-4">
          {SEVERITIES.map((severity) => (
            <div
              key={severity.id}
              className={`rounded-lg border p-4 ${TONE_CLASSES[severity.tone]}`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${TONE_DOT[severity.tone]}`}
                  aria-hidden="true"
                />
                <span className="font-medium">{severity.label}</span>
              </div>
              <p className="mt-2 text-sm text-foreground/80">
                {severity.description}
              </p>
              <ul className="mt-2 ml-5 list-disc space-y-0.5 text-xs text-foreground/70">
                {severity.examples.map((example) => (
                  <li key={example}>{example}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: 'response',
    number: '7',
    title: 'Response and Resolution Targets',
    body: (
      <>
        <p>
          The following targets apply from the moment an incident is
          classified at the applicable severity. &ldquo;Response&rdquo; means
          an initial substantive acknowledgement from a qualified support
          engineer, not an automated ticket receipt.
        </p>

        <Table caption="Response, update, and workaround targets by severity">
          <thead>
            <tr>
              <Th>Severity</Th>
              <Th>Initial response</Th>
              <Th>Status update cadence</Th>
              <Th>Workaround target</Th>
            </tr>
          </thead>
          <tbody>
            {RESPONSE_TARGETS.map((row) => (
              <tr key={row.severity}>
                <Td className="font-medium">{row.severity}</Td>
                <Td>{row.response}</Td>
                <Td>{row.update}</Td>
                <Td>{row.workaround}</Td>
              </tr>
            ))}
          </tbody>
        </Table>

        <p className="mt-4 text-sm text-muted-foreground">
          &ldquo;Workaround&rdquo; means a documented, operationally viable
          way for the customer to continue business operations. It does not
          mean a permanent fix. A permanent fix is tracked through normal
          engineering processes and is not subject to a response-time
          commitment under this SLA.
        </p>

        <p>
          Response and resolution targets apply to the customer&rsquo;s
          designated support contacts. Incidents must be reported through a
          supported channel to be eligible.
        </p>
      </>
    ),
  },
  {
    id: 'agent-approval',
    number: '8',
    title: 'Agent Approval SLAs',
    body: (
      <>
        <p>
          The Service uses autonomous AI agents to prepare, suggest, and
          audit. Actions that file, move bonded goods, or exceed a configured
          value threshold require human approval. This section describes the
          commitment around the routing of those approvals.
        </p>

        <Table caption="Approval routing targets">
          <thead>
            <tr>
              <Th>Approval type</Th>
              <Th>Routing target</Th>
              <Th>Availability</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td className="font-medium">
                Controlled-goods or bonded movement
              </Td>
              <Td>Routed to an available approver within 15 minutes</Td>
              <Td>24 × 7</Td>
            </tr>
            <tr>
              <Td className="font-medium">High-value shipment</Td>
              <Td>Routed to an available approver within 30 minutes</Td>
              <Td>Business Hours</Td>
            </tr>
            <tr>
              <Td className="font-medium">Standard approval</Td>
              <Td>Queued for review within 4 business hours</Td>
              <Td>Business Hours</Td>
            </tr>
          </tbody>
        </Table>

        <p className="mt-4">
          The routing target measures the time from when an approval request
          is created by a guardrail to when it is visible to at least one
          approver with the required role. It does not measure the time to
          approve or reject, which is a customer decision, not a Service
          commitment.
        </p>
        <p>
          If no approver is available within the routing target, the request
          escalates to the customer&rsquo;s designated escalation contact.
        </p>
      </>
    ),
  },
  {
    id: 'credits',
    number: '9',
    title: 'Service Credits',
    body: (
      <>
        <p>
          If we fail to meet the Monthly Uptime Percentage commitment in a
          calendar month, you are eligible to request a Service Credit
          calculated as a percentage of the monthly subscription fee for the
          affected Service.
        </p>

        <Table caption="Service credit schedule">
          <thead>
            <tr>
              <Th>Monthly Uptime Percentage</Th>
              <Th>Service Credit</Th>
            </tr>
          </thead>
          <tbody>
            {CREDIT_SCHEDULE.map((row) => (
              <tr key={row.uptimeRange}>
                <Td>{row.uptimeRange}</Td>
                <Td className="font-medium tabular-nums">
                  {row.credit} of monthly fee
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>

        <p className="mt-4">
          <strong className="font-medium">How to request.</strong> To receive
          a Service Credit, you must submit a written request within thirty
          (30) days of the end of the calendar month in which the failure
          occurred. The request must include the affected Service, a
          description of the incident, and the dates and times of the
          Downtime.
        </p>
        <p>
          <strong className="font-medium">Verification.</strong> We will
          verify the claim against our monitoring and incident records. Where
          our records and your records differ, our records prevail unless
          you provide evidence demonstrating a material discrepancy.
        </p>
        <p>
          <strong className="font-medium">Application.</strong> Service
          Credits are applied against future subscription fees. They are not
          paid in cash. They are not transferable. Aggregate Service Credits
          in any calendar month are capped at [PERCENTAGE — e.g. 50%] of the
          monthly subscription fee for the affected Service.
        </p>
        <p>
          <strong className="font-medium">Sole remedy.</strong> Service
          Credits are your sole and exclusive financial remedy for a failure
          to meet the Monthly Uptime Percentage commitment. They do not limit
          any other right you may have under the Terms of Service.
        </p>
      </>
    ),
  },
  {
    id: 'exclusions',
    number: '10',
    title: 'Exclusions',
    body: (
      <>
        <p>
          The Service Level commitments in this SLA do not apply to
          unavailability or degradation caused by:
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <strong className="font-medium">Scheduled Maintenance</strong>{' '}
            performed in accordance with Section 4;
          </li>
          <li>
            <strong className="font-medium">Force majeure events</strong>,
            including natural disasters, war, civil unrest, epidemics, and
            government action;
          </li>
          <li>
            <strong className="font-medium">
              Failures of third-party infrastructure
            </strong>{' '}
            that is outside our reasonable control, including cloud provider
            regional outages, DNS infrastructure, and internet backbone
            failures;
          </li>
          <li>
            <strong className="font-medium">
              Failures of third-party services
            </strong>{' '}
            we integrate with at your request, including ERP systems, carrier
            APIs, customs authority systems, and LLM providers;
          </li>
          <li>
            <strong className="font-medium">
              The customer&rsquo;s network, equipment, or configuration
            </strong>
            , including customer-side firewalls, proxies, and single sign-on
            providers;
          </li>
          <li>
            <strong className="font-medium">
              Customer-caused incidents
            </strong>
            , including misconfiguration, excessive API volume above the
            contracted rate limit, and submission of malformed data;
          </li>
          <li>
            <strong className="font-medium">
              Alpha, beta, or preview features
            </strong>{' '}
            that are expressly labelled as such in the Service or the
            documentation;
          </li>
          <li>
            <strong className="font-medium">
              Emergency security work
            </strong>{' '}
            that we perform to protect the Service or Customer Data, provided
            we use reasonable efforts to minimise disruption; and
          </li>
          <li>
            <strong className="font-medium">
              Suspension or termination for cause
            </strong>{' '}
            under the Terms of Service, including suspension for
            non-payment.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'measurement',
    number: '11',
    title: 'Measurement, Reporting, and Verification',
    body: (
      <>
        <p>
          Availability is measured continuously by external synthetic
          monitoring from at least three geographically distributed vantage
          points, at a probe frequency of no less than once per minute. A
          month is considered to have Downtime where a majority of probes
          fail consecutively for at least [NUMBER — e.g. 5] minutes.
        </p>
        <p>
          <strong className="font-medium">Status page.</strong> Current and
          historical Service status is published at{' '}
          <a
            href={STATUS_URL}
            className="underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {STATUS_URL}
          </a>
          . Incidents are posted within [NUMBER] minutes of internal
          acknowledgement.
        </p>
        <p>
          <strong className="font-medium">Monthly report.</strong> Customers
          on Enterprise plans receive a monthly availability report
          summarising uptime, incidents, and Scheduled Maintenance. The
          report is available to other customers on request.
        </p>
        <p>
          <strong className="font-medium">Audit rights.</strong> Enterprise
          customers may, no more than once per year, request reasonable
          evidence supporting our availability measurement. Evidence will be
          provided under the confidentiality terms in the Terms of Service.
        </p>
      </>
    ),
  },
  {
    id: 'escalation',
    number: '12',
    title: 'Escalation',
    body: (
      <>
        <p>
          If you are not satisfied with the handling of an incident, you may
          escalate it. Escalation paths are provided at onboarding and
          include a named technical escalation contact and, for Enterprise
          customers, a named account escalation contact.
        </p>

        <Table caption="Escalation levels">
          <thead>
            <tr>
              <Th>Level</Th>
              <Th>Who</Th>
              <Th>When to use</Th>
              <Th>Response</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td className="font-medium">1</Td>
              <Td>Support engineer</Td>
              <Td>Initial reporting; all incidents</Td>
              <Td>Per Section 7</Td>
            </tr>
            <tr>
              <Td className="font-medium">2</Td>
              <Td>Support team lead</Td>
              <Td>Response target missed, or resolution stalled</Td>
              <Td>2 business hours</Td>
            </tr>
            <tr>
              <Td className="font-medium">3</Td>
              <Td>Engineering on-call</Td>
              <Td>P1 not progressing toward resolution</Td>
              <Td>30 minutes, 24 × 7</Td>
            </tr>
            <tr>
              <Td className="font-medium">4</Td>
              <Td>Executive sponsor</Td>
              <Td>Commercial or contractual concern</Td>
              <Td>1 business day</Td>
            </tr>
          </tbody>
        </Table>
      </>
    ),
  },
  {
    id: 'changes',
    number: '13',
    title: 'Changes to this SLA',
    body: (
      <>
        <p>
          We may update this SLA from time to time. Material reductions in
          the commitment will be communicated at least thirty (30) days in
          advance. Non-material changes, including clarifications and
          corrections, take effect when posted.
        </p>
        <p>
          The version number and last updated date are shown at the top of
          this page. We maintain a changelog of prior versions on request.
        </p>
        <p>
          Where your order form contains a specific service level commitment
          that differs from this SLA, the order form prevails for the
          duration of the applicable subscription term.
        </p>
      </>
    ),
  },
  {
    id: 'contact',
    number: '14',
    title: 'Contact',
    body: (
      <>
        <p>
          Questions about this SLA, or requests for a Service Credit, may be
          directed to:
        </p>
        <dl className="mt-4 space-y-1 text-sm">
          <div className="flex gap-2">
            <dt className="min-w-40 text-muted-foreground">Support</dt>
            <dd>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {SUPPORT_EMAIL}
              </a>
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="min-w-40 text-muted-foreground">Status page</dt>
            <dd>
              <a
                href={STATUS_URL}
                className="underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {STATUS_URL}
              </a>
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="min-w-40 text-muted-foreground">Legal entity</dt>
            <dd>{COMPANY.legalName}</dd>
          </div>
        </dl>
      </>
    ),
  },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function DocumentHeader() {
  return (
    <header className="border-b pb-10">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="rounded-full border bg-background px-2.5 py-0.5 font-medium">
          Version {SLA_VERSION}
        </span>
        <span>·</span>
        <span>
          Effective <time dateTime={EFFECTIVE_DATE}>{EFFECTIVE_DATE}</time>
        </span>
        <span>·</span>
        <span>
          Last updated <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time>
        </span>
      </div>

      <h1 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        Service Level Agreement
      </h1>

      <p className="mt-4 max-w-2xl text-pretty text-muted-foreground">
        The availability, support, incident response, and service credit
        commitments that apply to the TradeOps platform. This SLA forms part
        of your agreement with {COMPANY.legalName}.
      </p>
    </header>
  );
}

function TableOfContents() {
  return (
    <nav
      aria-label="Table of contents"
      className="print:hidden lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto"
    >
      <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Contents
      </h2>
      <ol className="mt-4 space-y-1.5 text-sm">
        {SECTIONS.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="flex gap-2 rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span className="tabular-nums text-muted-foreground/60">
                {section.number}.
              </span>
              <span>{section.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function SlaSection({ section }: { section: Section }) {
  return (
    <section
      id={section.id}
      aria-labelledby={`${section.id}-heading`}
      className="scroll-mt-24"
    >
      <h2
        id={`${section.id}-heading`}
        className="flex gap-3 text-lg font-semibold tracking-tight"
      >
        <span className="tabular-nums text-muted-foreground/70">
          {section.number}.
        </span>
        <span>{section.title}</span>
      </h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-foreground/90 [&_p]:text-pretty">
        {section.body}
      </div>
    </section>
  );
}

export default function SLAPage() {
  return (
    <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[280px_1fr] lg:gap-12">
      <TableOfContents />
      <article className="prose prose-muted max-w-none">
        <DocumentHeader />
        {SECTIONS.map((section) => (
          <SlaSection key={section.id} section={section} />
        ))}
      </article>
    </div>
  );
}