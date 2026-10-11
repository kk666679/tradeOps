import * as React from 'react';
import type { Metadata } from 'next';

/**
 * ============================================================================
 * TEMPLATE — NOT LEGAL ADVICE
 * ============================================================================
 *
 * This file is a structural template for a Data Processing Agreement page.
 * It is not a substitute for legal review. A DPA interacts with the customer's
 * own privacy obligations under their jurisdiction's law, and an incorrectly
 * drafted DPA is worse than none at all. Before publishing:
 *
 *   1. Have a lawyer qualified in data protection review every section.
 *      Malaysia's PDPA 2010, the EU GDPR, the UK GDPR, and Singapore's PDPA
 *      each impose different mandatory clauses. The DPA you ship must satisfy
 *      the strictest jurisdiction in which you have customers.
 *
 *   2. Confirm which regime(s) apply to your customer base. If you have EU
 *      customers, the Standard Contractual Clauses (SCCs) are mandatory as
 *      an annex. If you have UK customers, the UK IDTA or Addendum applies.
 *      If you have only Malaysian customers, the PDPA 2010 governs and the
 *      SCCs are not required but are commonly included as a matter of
 *      good practice.
 *
 *   3. Complete Schedule A with the actual categories of personal data you
 *      process and the actual purposes. Do not generalise. Regulators and
 *      customers look for specificity here, and a vague schedule is a
 *      compliance gap.
 *
 *   4. Complete Schedule B with the actual technical and organisational
 *      measures you have implemented. Do not list measures you aspire to.
 *      A measure listed here is a contractual commitment.
 *
 *   5. Maintain the sub-processor list at the URL referenced in Section 7.
 *      Update it before engaging a new sub-processor, not after.
 *
 *   6. Confirm your breach notification timeline in Section 9 is achievable.
 *      "Without undue delay" is a legal standard; a specific hour count is a
 *      contractual commitment. Do not promise 24 hours if your detection and
 *      assessment process takes 72.
 *
 *   7. Confirm the cross-border transfer mechanism in Section 11 matches how
 *      you actually store and process data. If your cloud provider's data
 *      plane is in Singapore and your customers are in the EU, you need a
 *      transfer mechanism for that flow, not a generic statement.
 *
 *   8. If you have customers in multiple jurisdictions, consider whether this
 *      DPA should be a baseline that is supplemented by an order-form
 *      schedule per customer, rather than a single document that tries to
 *      satisfy everyone.
 *
 * The data categories, processing purposes, retention periods, and TOM
 * entries in this template are illustrative for a customs and Free Zone
 * platform. They must be verified against your actual architecture and
 * data flows before publication.
 * ============================================================================
 */

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

const BASE_URL = 'https://tradeops.example';
const PAGE_URL = `${BASE_URL}/legal/dpa`;
const PAGE_TITLE = 'Data Processing Agreement';
const PAGE_DESCRIPTION =
  'The terms under which TradeOps processes personal data on behalf of ' +
  'customers using the TradeOps platform for Free Industrial Zone, Free ' +
  'Commercial Zone, and bonded warehouse operations.';

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

const DPA_VERSION = '1.0.0';
const EFFECTIVE_DATE = '2026-01-01';
const LAST_UPDATED = '2026-10-10';
const COMPANY = {
  legalName: '[COMPANY LEGAL NAME]',
  registrationNo: '[COMPANY REGISTRATION NUMBER]',
  address: '[REGISTERED ADDRESS]',
  country: 'Malaysia',
};
const DPO_EMAIL = 'dpo@tradeops.example';
const PRIVACY_EMAIL = 'privacy@tradeops.example';
const SECURITY_EMAIL = 'security@tradeops.example';
const SUBPROCESSOR_URL = 'https://tradeops.example/legal/subprocessors';
const STATUS_URL = 'https://status.tradeops.example';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Section = {
  id: string;
  number: string;
  title: string;
  kind?: 'section' | 'schedule';
  body: React.ReactNode;
};

// ---------------------------------------------------------------------------
// Table primitives — consistent with the Terms and SLA pages
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
    id: 'summary',
    number: '',
    title: 'Summary for customers',
    kind: 'section',
    body: (
      <>
        <p>
          This DPA is a dense document because data protection law is dense.
          Before the detailed terms, here is a plain-language summary of the
          commitments it contains.
        </p>

        <div className="my-6 rounded-xl border bg-muted/30 p-6">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                Your role
              </dt>
              <dd className="mt-1 text-sm">
                You are the <strong className="font-medium">controller</strong>{' '}
                of the personal data you submit to the Service.
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                Our role
              </dt>
              <dd className="mt-1 text-sm">
                We are the{' '}
                <strong className="font-medium">processor</strong>. We act only
                on your documented instructions.
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                Sub-processors
              </dt>
              <dd className="mt-1 text-sm">
                We use a small number of vetted sub-processors. The current
                list is maintained at{' '}
                <a
                  href={SUBPROCESSOR_URL}
                  className="underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  our sub-processor page
                </a>
                .
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                Breach notification
              </dt>
              <dd className="mt-1 text-sm">
                We notify you within{' '}
                <strong className="font-medium">48 hours</strong> of
                discovering a personal data breach affecting your data.
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                Security measures
              </dt>
              <dd className="mt-1 text-sm">
                Encryption in transit and at rest, tenant isolation, audit
                logging, and 24×7 detection. The full list is in{' '}
                <a
                  href="#schedule-b"
                  className="underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Schedule B
                </a>
                .
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                On termination
              </dt>
              <dd className="mt-1 text-sm">
                We delete or return your personal data, at your choice, within
                60 days of termination.
              </dd>
            </div>
          </dl>
        </div>

        <p className="text-xs text-muted-foreground">
          This summary is provided for convenience only. It does not modify
          the terms below and does not create any obligation not expressed in
          full elsewhere in this DPA.
        </p>
      </>
    ),
  },
  {
    id: 'overview',
    number: '1',
    title: 'Overview and Scope',
    body: (
      <>
        <p>
          This Data Processing Agreement (the &ldquo;DPA&rdquo;) forms part
          of the agreement between you and {COMPANY.legalName}{' '}
          (&ldquo;TradeOps&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or
          &ldquo;our&rdquo;) governing your use of the TradeOps platform and
          related services (the &ldquo;Service&rdquo;), and sets out the terms
          under which we process Personal Data on your behalf.
        </p>
        <p>
          This DPA applies where and to the extent that we process Personal
          Data as a processor on your behalf in the course of providing the
          Service. It does not apply to Personal Data we process as a
          controller in our own right — for example, account registration
          data, billing data, and website analytics — which is governed by
          our Privacy Policy.
        </p>
        <p>
          This DPA is incorporated into and forms part of the Terms of
          Service. Where there is a conflict between this DPA and the Terms
          of Service on a matter concerning the processing of Personal Data,
          this DPA prevails.
        </p>
        <p>
          Capitalised terms not defined in this DPA have the meaning given to
          them in the Terms of Service. Where a term is defined in both this
          DPA and applicable Data Protection Law, the definition in the
          applicable law prevails to the extent of the inconsistency.
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
            &ldquo;Data Protection Law&rdquo;
          </dt>
          <dd className="text-muted-foreground">
            means all applicable laws and regulations relating to the
            protection of Personal Data, including, as applicable, the
            Malaysian Personal Data Protection Act 2010, the EU General Data
            Protection Regulation (Regulation (EU) 2016/679), the UK GDPR, and
            any successor legislation.
          </dd>
        </div>
        <div>
          <dt className="font-medium text-foreground">
            &ldquo;Controller&rdquo;
          </dt>
          <dd className="text-muted-foreground">
            means the natural or legal person which alone or jointly with
            others determines the purposes and means of the processing of
            Personal Data.
          </dd>
        </div>
        <div>
          <dt className="font-medium text-foreground">
            &ldquo;Personal Data&rdquo;
          </dt>
          <dd className="text-muted-foreground">
            means any information relating to an identified or identifiable
            natural person that you submit to or generate within the Service,
            or that we process on your behalf in the course of providing the
            Service.
          </dd>
        </div>
        <div>
          <dt className="font-medium text-foreground">
            &ldquo;Personal Data Breach&rdquo;
          </dt>
          <dd className="text-muted-foreground">
            means a breach of security leading to the accidental or unlawful
            destruction, loss, alteration, unauthorised disclosure of, or
            access to, Personal Data transmitted, stored, or otherwise
            processed by us on your behalf.
          </dd>
        </div>
        <div>
          <dt className="font-medium text-foreground">
            &ldquo;Processing&rdquo;
          </dt>
          <dd className="text-muted-foreground">
            means any operation performed on Personal Data, including
            collection, recording, organisation, storage, adaptation,
            retrieval, consultation, use, disclosure, transmission,
            erasure, or destruction.
          </dd>
        </div>
        <div>
          <dt className="font-medium text-foreground">
            &ldquo;Processor&rdquo;
          </dt>
          <dd className="text-muted-foreground">
            means the natural or legal person which processes Personal Data
            on behalf of the Controller.
          </dd>
        </div>
        <div>
          <dt className="font-medium text-foreground">
            &ldquo;Sub-processor&rdquo;
          </dt>
          <dd className="text-muted-foreground">
            means any processor engaged by us to process Personal Data on
            your behalf in connection with the Service.
          </dd>
        </div>
        <div>
          <dt className="font-medium text-foreground">
            &ldquo;Supervisory Authority&rdquo;
          </dt>
          <dd className="text-muted-foreground">
            means an independent public authority responsible for monitoring
            the application of Data Protection Law, including, in Malaysia,
            the Personal Data Protection Commissioner.
          </dd>
        </div>
      </dl>
    ),
  },
  {
    id: 'roles',
    number: '3',
    title: 'Roles of the Parties',
    body: (
      <>
        <p>
          The parties acknowledge and agree that, with respect to Personal
          Data processed in connection with the Service:
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <strong className="font-medium">You are the Controller.</strong>{' '}
            You determine the purposes and means of the processing of Personal
            Data submitted to the Service, and you are responsible for
            compliance with Data Protection Law in respect of that
            processing.
          </li>
          <li>
            <strong className="font-medium">We are the Processor.</strong> We
            process Personal Data on your behalf and only on your documented
            instructions, as set out in this DPA and as otherwise agreed in
            writing between the parties.
          </li>
          <li>
            <strong className="font-medium">
              You are responsible for the lawfulness of the processing.
            </strong>{' '}
            You represent and warrant that you have a lawful basis for the
            processing of Personal Data you submit to the Service, and that
            you have provided all notices and obtained all consents required
            under applicable Data Protection Law.
          </li>
        </ul>
        <p>
          Where you and we jointly determine the purposes and means of a
          particular processing activity, we will enter into a separate
          arrangement specifying the respective responsibilities, in
          accordance with applicable Data Protection Law.
        </p>
      </>
    ),
  },
  {
    id: 'processing',
    number: '4',
    title: 'Processing Instructions and Details',
    body: (
      <>
        <p>
          We process Personal Data only on your documented instructions. The
          subject matter, duration, nature, and purpose of the processing,
          the types of Personal Data, and the categories of Data Subjects are
          set out in <a
            href="#schedule-a"
            className="underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Schedule A
          </a>.
        </p>
        <p>
          Your instructions are:
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            the configuration and use of the Service by you and your
            Authorised Users;
          </li>
          <li>
            the submission of Personal Data by you to the Service;
          </li>
          <li>
            this DPA and the Terms of Service; and
          </li>
          <li>
            any additional written instructions agreed between the parties.
          </li>
        </ul>
        <p>
          We will notify you promptly if, in our opinion, an instruction
          infringes applicable Data Protection Law. We may suspend performance
          of the affected instruction until it is amended or confirmed in
          writing by you, and we will not be liable for any delay or
          non-performance caused by such suspension.
        </p>
        <p>
          We may process Personal Data where required to do so by law, in
          which case we will inform you of the legal requirement before
          processing, unless prohibited from doing so by law.
        </p>
      </>
    ),
  },
  {
    id: 'confidentiality',
    number: '5',
    title: 'Confidentiality',
    body: (
      <>
        <p>
          We will ensure that any personnel authorised to process Personal
          Data on our behalf:
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            are informed of the confidential nature of the Personal Data;
          </li>
          <li>
            have received appropriate training on their responsibilities
            under applicable Data Protection Law and under this DPA;
          </li>
          <li>
            are subject to appropriate written confidentiality obligations
            that survive termination of their engagement; and
          </li>
          <li>
            are granted access to Personal Data only on a need-to-know basis,
            following the principle of least privilege.
          </li>
        </ul>
        <p>
          Our confidentiality obligations under this DPA do not apply where
          disclosure is required by law, regulation, or a competent court or
          authority, provided we notify you of the requirement where legally
          permitted.
        </p>
      </>
    ),
  },
  {
    id: 'security',
    number: '6',
    title: 'Security Measures',
    body: (
      <>
        <p>
          Taking into account the state of the art, the costs of
          implementation, and the nature, scope, context, and purposes of the
          processing, as well as the risk of varying likelihood and severity
          for the rights and freedoms of natural persons, we implement
          appropriate technical and organisational measures to ensure a level
          of security appropriate to the risk.
        </p>
        <p>
          The current technical and organisational measures we maintain are
          set out in <a
            href="#schedule-b"
            className="underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Schedule B
          </a>
          . We may update those measures from time to time, provided that the
          level of protection is not materially reduced. We will notify you
          of material reductions in the level of protection in accordance
          with Section 15.
        </p>
        <p>
          We will take reasonable steps to ensure that any person acting under
          our authority who has access to Personal Data processes it only on
          our instructions, unless otherwise required by law.
        </p>
      </>
    ),
  },
  {
    id: 'subprocessors',
    number: '7',
    title: 'Sub-processors',
    body: (
      <>
        <p>
          You grant us general written authorisation to engage
          Sub-processors to process Personal Data, subject to the
          requirements in this section.
        </p>

        <p>
          The current Sub-processors engaged by us are listed at{' '}
          <a
            href={SUBPROCESSOR_URL}
            className="underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {SUBPROCESSOR_URL}
          </a>
          . The list includes the identity of each Sub-processor, the country
          in which it processes Personal Data, and the purpose for which it
          is engaged.
        </p>

        <p>
          <strong className="font-medium">
            Notification of changes.
          </strong>{' '}
          We will notify you at least thirty (30) days before engaging a new
          Sub-processor or replacing an existing one. Notification will be
          sent to the administrative contact on your account and posted to
          the sub-processor page.
        </p>

        <p>
          <strong className="font-medium">Right to object.</strong> You may
          object to a new Sub-processor by notifying us in writing within
          thirty (30) days of our notice. If you object on reasonable data
          protection grounds, we will work with you in good faith to find a
          commercially reasonable alternative. If no alternative is
          feasible, you may terminate the affected part of the Service
          without penalty, and we will refund any prepaid fees for the
          unexpired portion of the term.
        </p>

        <p>
          <strong className="font-medium">
            Flow-down obligations.
          </strong>{' '}
          When we engage a Sub-processor, we enter into a written agreement
          that imposes data protection obligations substantially the same as
          those in this DPA. Where a Sub-processor fails to fulfil those
          obligations, we remain liable to you for the performance of the
          Sub-processor&rsquo;s obligations.
        </p>
      </>
    ),
  },
  {
    id: 'data-subject-rights',
    number: '8',
    title: 'Data Subject Rights',
    body: (
      <>
        <p>
          The Service provides you with the ability to access, correct,
          export, and delete Personal Data within the Service, and to
          restrict or object to certain processing, through the interface and
          the API.
        </p>
        <p>
          Where a Data Subject makes a request to us directly in respect of
          Personal Data we process on your behalf, we will:
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            not respond to the Data Subject directly unless legally required
            to do so;
          </li>
          <li>
            forward the request to you within five (5) business days of
            receipt;
          </li>
          <li>
            provide reasonable assistance to you in responding to the
            request, including by providing the functionality and the
            information reasonably necessary to enable you to comply.
          </li>
        </ul>
        <p>
          Where the Service cannot, by itself, allow you to fully respond to
          a Data Subject request, we will provide additional assistance on
          request, taking into account the nature of the processing and the
          information available to us.
        </p>
      </>
    ),
  },
  {
    id: 'breach',
    number: '9',
    title: 'Personal Data Breach Notification',
    body: (
      <>
        <p>
          We maintain detection, response, and notification procedures
          designed to identify and address Personal Data Breaches promptly.
        </p>

        <p>
          We will notify you of a Personal Data Breach affecting your
          Personal Data without undue delay, and in any event within{' '}
          <strong className="font-medium">
            forty-eight (48) hours
          </strong>{' '}
          of becoming aware of it.
        </p>

        <p>The notification will include, to the extent known at the time:</p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>a description of the nature of the breach;</li>
          <li>
            the categories and approximate number of Data Subjects and
            records concerned;
          </li>
          <li>
            the name and contact details of our data protection officer or
            other point of contact;
          </li>
          <li>the likely consequences of the breach; and</li>
          <li>
            the measures taken or proposed to address the breach and mitigate
            its possible adverse effects.
          </li>
        </ul>

        <p>
          Where, and in so far as, it is not possible to provide all of this
          information at the same time, we will provide it in phases without
          further undue delay.
        </p>

        <Table caption="Breach notification timeline">
          <thead>
            <tr>
              <Th>Stage</Th>
              <Th>Target</Th>
              <Th>Owner</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td className="font-medium">Discovery to assessment</Td>
              <Td>Within 4 hours of detection</Td>
              <Td>Security operations</Td>
            </tr>
            <tr>
              <Td className="font-medium">
                Assessment to customer notification
              </Td>
              <Td>Within 48 hours of discovery</Td>
              <Td>Data protection officer</Td>
            </tr>
            <tr>
              <Td className="font-medium">
                Customer notification to regulator notification
              </Td>
              <Td>Per the customer&rsquo;s own legal obligations</Td>
              <Td>Customer (we assist on request)</Td>
            </tr>
            <tr>
              <Td className="font-medium">Post-incident report</Td>
              <Td>Within 10 business days of closure</Td>
              <Td>Security operations</Td>
            </tr>
          </tbody>
        </Table>

        <p className="mt-4 text-sm text-muted-foreground">
          We do not notify Supervisory Authorities or Data Subjects on your
          behalf. Notification to regulators and Data Subjects is your
          responsibility as the Controller. We will provide reasonable
          assistance with any such notification on request.
        </p>
      </>
    ),
  },
  {
    id: 'dpia',
    number: '10',
    title: 'Data Protection Impact Assessments',
    body: (
      <>
        <p>
          Where a type of processing is likely to result in a high risk to
          the rights and freedoms of natural persons, you may be required to
          carry out a data protection impact assessment (DPIA) and, in some
          cases, to consult the relevant Supervisory Authority.
        </p>
        <p>
          We will provide reasonable assistance to you in connection with any
          DPIA you are required to carry out in respect of the Service,
          including by:
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            providing information about the processing operations carried out
            by the Service;
          </li>
          <li>
            providing information about the technical and organisational
            measures we maintain, as described in Schedule B;
          </li>
          <li>
            participating in good faith in discussions about the risks and
            mitigations relevant to your DPIA; and
          </li>
          <li>
            providing supporting documentation reasonably requested, subject
            to appropriate confidentiality protections.
          </li>
        </ul>
        <p>
          Assistance is provided at your cost where the request requires
          material additional effort, and is subject to the limits on
          assistance set out in Section 14.
        </p>
      </>
    ),
  },
  {
    id: 'transfers',
    number: '11',
    title: 'Cross-Border Transfers',
    body: (
      <>
        <p>
          You acknowledge that, in the course of providing the Service, we
          may transfer Personal Data to, and process Personal Data in,
          jurisdictions other than the jurisdiction in which the Personal
          Data was originally collected.
        </p>

        <p>
          Where we transfer Personal Data from a jurisdiction that restricts
          such transfers, we will ensure that the transfer is subject to
          appropriate safeguards in accordance with applicable Data Protection
          Law. Depending on the source jurisdiction of the Personal Data, the
          applicable safeguard may include:
        </p>

        <Table caption="Cross-border transfer mechanisms by source jurisdiction">
          <thead>
            <tr>
              <Th>Source jurisdiction</Th>
              <Th>Mechanism</Th>
              <Th>Notes</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td className="font-medium">Malaysia</Td>
              <Td>
                Section 129 of the PDPA 2010, or applicable derogation, or
                consent
              </Td>
              <Td>
                Transfers outside Malaysia are permitted to jurisdictions
                with substantially similar law, or with the Data
                Subject&rsquo;s consent, or under other listed derogations
              </Td>
            </tr>
            <tr>
              <Td className="font-medium">
                European Economic Area or UK
              </Td>
              <Td>
                Standard Contractual Clauses (EU) or UK IDTA / Addendum, as
                applicable, incorporated as{' '}
                <a
                  href="#annex-1"
                  className="underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Annex 1
                </a>
              </Td>
              <Td>
                Supplemented by the transfer impact assessment maintained by
                us and available on request
              </Td>
            </tr>
            <tr>
              <Td className="font-medium">
                Other jurisdictions
              </Td>
              <Td>
                Applicable transfer mechanism under local law, or
                contractual safeguards substantially equivalent to this DPA
              </Td>
              <Td>
                The specific mechanism is determined by the source
                jurisdiction
              </Td>
            </tr>
          </tbody>
        </Table>

        <p className="mt-4">
          You may select a specific data residency region through the Service
          where the option is made available to you. Where you have selected
          a residency region, your Personal Data will be stored and processed
          within that region, subject to the exceptions set out in the
          applicable order form and our Privacy Policy.
        </p>

        <p>
          You may request a copy of the applicable transfer mechanism, and of
          the transfer impact assessment, by contacting{' '}
          <a
            href={`mailto:${PRIVACY_EMAIL}`}
            className="underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {PRIVACY_EMAIL}
          </a>
          . Copies will be provided under the confidentiality terms of the
          Terms of Service and may be redacted to the extent necessary to
          protect the confidentiality of commercially sensitive information.
        </p>
      </>
    ),
  },
  {
    id: 'audit',
    number: '12',
    title: 'Audits and Inspections',
    body: (
      <>
        <p>
          We will make available to you all information reasonably necessary
          to demonstrate compliance with this DPA. We do so primarily through
          the mechanisms described below, in the following order of
          precedence.
        </p>

        <p>
          <strong className="font-medium">
            1. Documentation and self-certification.
          </strong>{' '}
          We maintain a current summary of our technical and organisational
          measures, our Sub-processor list, and our security certification
          status, all of which are available on request.
        </p>

        <p>
          <strong className="font-medium">
            2. Third-party audit reports.
          </strong>{' '}
          Where we hold a current audit report or certification from an
          independent auditor or standards body (for example, ISO/IEC 27001
          or SOC 2 Type II), we will provide that report to you on request in
          lieu of a direct audit. Reports are provided under the
          confidentiality terms of the Terms of Service.
        </p>

        <p>
          <strong className="font-medium">
            3. Written questionnaires.
          </strong>{' '}
          Where the available documentation and reports are insufficient,
          we will respond to reasonable written security and data protection
          questionnaires within thirty (30) days of receipt.
        </p>

        <p>
          <strong className="font-medium">4. On-site audits.</strong> Where
          none of the above is sufficient, you (or an independent auditor
          appointed by you, not a competitor of ours) may conduct an on-site
          audit, subject to the following conditions:
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            audits are conducted no more than once per twelve-month period,
            unless required by a Supervisory Authority or following a
            material Personal Data Breach;
          </li>
          <li>
            audits are conducted during normal business hours and with at
            least thirty (30) days&rsquo; prior written notice;
          </li>
          <li>
            the auditor is bound by written confidentiality obligations no
            less protective than those in the Terms of Service;
          </li>
          <li>
            the audit is scoped to the specific scope necessary to verify
            compliance with this DPA; and
          </li>
          <li>
            you bear the costs of the audit, including any reasonable costs
            incurred by us in supporting it.
          </li>
        </ul>
        <p>
          Nothing in this section requires us to grant access to premises or
          systems in a manner that would compromise the confidentiality of
          other customers, present a security risk, or breach a legal or
          contractual obligation owed to a third party.
        </p>
      </>
    ),
  },
  {
    id: 'return-deletion',
    number: '13',
    title: 'Return and Deletion of Personal Data',
    body: (
      <>
        <p>
          On termination or expiry of the Service, or on your written request
          at any time, we will, at your choice, delete or return to you all
          Personal Data processed on your behalf, and delete existing copies,
          unless applicable law requires us to retain the Personal Data.
        </p>

        <p>
          <strong className="font-medium">Export.</strong> Where you choose
          to have Personal Data returned, we will make it available to you in
          a structured, commonly used, machine-readable format, using the
          export functionality of the Service or, if that functionality is
          insufficient, through an alternative mechanism we provide. Exports
          are made available for a period of{' '}
          <strong className="font-medium">sixty (60) days</strong> from the
          date of termination, after which we may delete the Personal Data
          without further notice.
        </p>

        <p>
          <strong className="font-medium">Deletion.</strong> Where you choose
          to have Personal Data deleted, we will delete it from active
          systems within{' '}
          <strong className="font-medium">thirty (30) days</strong> of the
          request. Residual copies may remain in encrypted backups for the
          duration of our standard backup retention cycle, during which they
          are inaccessible to normal operations and are deleted on expiry of
          the cycle.
        </p>

        <p>
          <strong className="font-medium">
            Legal retention obligations.
          </strong>{' '}
          We may retain Personal Data to the extent required by applicable
          law, including customs and tax recordkeeping obligations. Where we
          retain Personal Data under such an obligation, we will:
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            process it only for the purpose of the applicable legal
            obligation;
          </li>
          <li>
            keep it segregated from any other processing to the extent
            technically feasible;
          </li>
          <li>
            maintain the security measures described in Schedule B; and
          </li>
          <li>
            delete it promptly once the legal retention obligation expires.
          </li>
        </ul>

        <p>
          We will provide written certification of deletion on your request,
          signed by an authorised representative.
        </p>
      </>
    ),
  },
  {
    id: 'liability',
    number: '14',
    title: 'Liability',
    body: (
      <>
        <p>
          Each party&rsquo;s liability under or in connection with this DPA
          is subject to the limitations and exclusions of liability set out
          in the Terms of Service, save that nothing in this DPA limits
          liability for:
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            breach of confidentiality obligations;
          </li>
          <li>
            wilful misconduct or gross negligence; or
          </li>
          <li>
            any liability that cannot be limited under applicable law.
          </li>
        </ul>
        <p>
          Where the Terms of Service provide that we are liable for the acts
          and omissions of our Sub-processors as if they were our own, that
          provision applies equally to this DPA.
        </p>
      </>
    ),
  },
  {
    id: 'term',
    number: '15',
    title: 'Term, Termination, and Changes',
    body: (
      <>
        <p>
          This DPA takes effect on the effective date of the Service and
          continues until the later of: (a) the date on which we cease
          processing Personal Data on your behalf, or (b) the date on which
          we complete return or deletion of Personal Data under Section 13.
        </p>
        <p>
          The provisions of this DPA that by their nature should survive
          termination will survive, including Sections 5 (Confidentiality),
          13 (Return and Deletion), 14 (Liability), and 17 (Governing Law).
        </p>
        <p>
          We may update this DPA from time to time. Material changes will be
          communicated at least thirty (30) days in advance. If you do not
          agree to a material change, you may terminate the affected part of
          the Service in accordance with the Terms of Service.
        </p>
        <p>
          Where an order form contains terms specific to data protection that
          differ from this DPA, the order form prevails for the duration of
          the applicable subscription term.
        </p>
      </>
    ),
  },
  {
    id: 'contact-dpa',
    number: '16',
    title: 'Contact and Notices',
    body: (
      <>
        <p>
          Notices under this DPA must be given in writing and delivered to
          the addresses set out below.
        </p>

        <dl className="mt-4 space-y-1 text-sm">
          <div className="flex gap-2">
            <dt className="min-w-44 text-muted-foreground">
              Data protection officer
            </dt>
            <dd>
              <a
                href={`mailto:${DPO_EMAIL}`}
                className="underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {DPO_EMAIL}
              </a>
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="min-w-44 text-muted-foreground">Privacy</dt>
            <dd>
              <a
                href={`mailto:${PRIVACY_EMAIL}`}
                className="underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {PRIVACY_EMAIL}
              </a>
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="min-w-44 text-muted-foreground">Security</dt>
            <dd>
              <a
                href={`mailto:${SECURITY_EMAIL}`}
                className="underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {SECURITY_EMAIL}
              </a>
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="min-w-44 text-muted-foreground">Legal entity</dt>
            <dd>{COMPANY.legalName}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="min-w-44 text-muted-foreground">Registration</dt>
            <dd>{COMPANY.registrationNo}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="min-w-44 text-muted-foreground">Address</dt>
            <dd>{COMPANY.address}</dd>
          </div>
        </dl>

        <p className="mt-4">
          A party may update its notice address by giving written notice to
          the other party in accordance with this section. Notices sent by
          email are deemed delivered on the next business day following
          transmission, provided no bounce or error is received.
        </p>
      </>
    ),
  },
  {
    id: 'governing-law',
    number: '17',
    title: 'Governing Law and Dispute Resolution',
    body: (
      <>
        <p>
          This DPA is governed by the same governing law and subject to the
          same dispute resolution mechanism as the Terms of Service, unless a
          mandatory provision of applicable Data Protection Law requires
          otherwise.
        </p>
        <p>
          Where a Supervisory Authority has jurisdiction over the processing
          of Personal Data under this DPA, nothing in this section prevents
          that authority from exercising its powers, or either party from
          bringing a matter before it.
        </p>
      </>
    ),
  },
  {
    id: 'schedule-a',
    number: 'A',
    title: 'Schedule A — Details of Processing',
    kind: 'schedule',
    body: (
      <>
        <p>
          This Schedule describes the processing of Personal Data carried out
          by us on your behalf in connection with the Service. It is
          incorporated into and forms part of this DPA.
        </p>

        <h3 className="mt-6 text-sm font-semibold tracking-tight">
          A.1 Subject matter
        </h3>
        <p>
          The provision of the TradeOps platform for the operational and
          regulatory lifecycle of cargo moving through a Container Freight
          Station, Free Industrial Zone, Free Commercial Zone, or bonded
          warehouse — including cargo management, inventory, slot
          allocation, gate operations, bonded ledger, documentation
          preparation, declaration support, audit logging, and the
          agent-assisted workflows that operate on those functions.
        </p>

        <h3 className="mt-6 text-sm font-semibold tracking-tight">
          A.2 Duration
        </h3>
        <p>
          The duration of the processing is the term of your subscription to
          the Service, plus any period during which we retain Personal Data
          under Section 13 of this DPA.
        </p>

        <h3 className="mt-6 text-sm font-semibold tracking-tight">
          A.3 Nature and purpose
        </h3>
        <p>
          The processing consists of collection, recording, organisation,
          structuring, storage, adaptation, retrieval, consultation, use,
          disclosure by transmission, alignment, combination, restriction,
          erasure, and destruction of Personal Data, carried out for the
          purposes of:
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li>operating the Service in accordance with your instructions;</li>
          <li>
            providing the functionality you have subscribed to, including
            cargo, inventory, gate, and declaration features;
          </li>
          <li>
            performing audit logging and evidentiary record-keeping required
            for customs and compliance purposes;
          </li>
          <li>
            providing support, maintenance, and security operations;
          </li>
          <li>
            providing the assistance described in Sections 8, 9, 10, and 12
            of this DPA; and
          </li>
          <li>
            complying with our own legal obligations, where applicable.
          </li>
        </ul>

        <h3 className="mt-6 text-sm font-semibold tracking-tight">
          A.4 Categories of Data Subjects
        </h3>
        <Table caption="Categories of Data Subjects whose Personal Data may be processed">
          <thead>
            <tr>
              <Th>Category</Th>
              <Th>Examples</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td className="font-medium">
                Authorised Users of the Service
              </Td>
              <Td>
                Your employees, contractors, and agents who are granted
                access to the Service
              </Td>
            </tr>
            <tr>
              <Td className="font-medium">
                Personnel of your counterparties
              </Td>
              <Td>
                Employees and contractors of shippers, consignees, carriers,
                freight forwarders, customs brokers, and other parties whose
                details appear in cargo documentation
              </Td>
            </tr>
            <tr>
              <Td className="font-medium">
                Personnel of your service providers
              </Td>
              <Td>
                Drivers, warehouse staff, and other operational personnel
                whose details appear in gate records, weighbridge tickets, or
                service contracts
              </Td>
            </tr>
            <tr>
              <Td className="font-medium">
                Individuals named in customs filings
              </Td>
              <Td>
                Declarants, signatories, and other individuals named on
                customs declarations, permits, or certificates
              </Td>
            </tr>
          </tbody>
        </Table>

        <h3 className="mt-6 text-sm font-semibold tracking-tight">
          A.5 Categories of Personal Data
        </h3>
        <Table caption="Categories of Personal Data that may be processed">
          <thead>
            <tr>
              <Th>Category</Th>
              <Th>Examples</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td className="font-medium">Identification data</Td>
              <Td>
                Name, job title, employer, business email, business phone
                number, and where required by customs or compliance rules,
                identification document number
              </Td>
            </tr>
            <tr>
              <Td className="font-medium">Access and audit data</Td>
              <Td>
                Login identifiers, authentication events, IP addresses,
                session metadata, and audit log entries recording the
                actions taken within the Service
              </Td>
            </tr>
            <tr>
              <Td className="font-medium">Cargo and shipment data</Td>
              <Td>
                Data relating to individuals appearing in cargo
                documentation, including names on bills of lading, invoices,
                packing lists, gate passes, and weighbridge tickets
              </Td>
            </tr>
            <tr>
              <Td className="font-medium">Communications data</Td>
              <Td>
                Correspondence with support, records of approvals and
                rejections, and notes attached to shipments or declarations
              </Td>
            </tr>
          </tbody>
        </Table>

        <p className="mt-4 text-sm text-muted-foreground">
          <strong className="font-medium">Special category data.</strong> The
          Service is not designed to process special categories of Personal
          Data (such as data revealing racial or ethnic origin, political
          opinions, religious beliefs, health, or sexual orientation) and you
          must not submit such data to the Service. If your use of the
          Service requires processing of special category data, contact us
          before submitting the data so that we can discuss whether
          additional safeguards are required.
        </p>

        <h3 className="mt-6 text-sm font-semibold tracking-tight">
          A.6 Retention periods
        </h3>
        <p>
          Personal Data is retained in accordance with your configuration of
          the Service and with any applicable legal retention obligations.
          Customs and tax recordkeeping obligations may require records to be
          retained for a minimum period, which varies by jurisdiction. We do
          not delete records that we are legally required to retain. Where
          records are retained under a legal obligation, we apply the
          segregation and minimisation controls described in Section 13 of
          this DPA.
        </p>
      </>
    ),
  },
  {
    id: 'schedule-b',
    number: 'B',
    title: 'Schedule B — Technical and Organisational Measures',
    kind: 'schedule',
    body: (
      <>
        <p>
          This Schedule describes the technical and organisational measures
          we maintain to protect Personal Data against accidental or unlawful
          destruction, loss, alteration, unauthorised disclosure, or access.
          It is incorporated into and forms part of this DPA.
        </p>
        <p>
          We review these measures at least annually and update them where
          appropriate. We may substitute a measure with one that provides
          substantially equivalent or greater protection without notice. We
          will notify you of any material reduction in the level of
          protection in accordance with Section 15 of this DPA.
        </p>

        <Table caption="Technical and organisational measures">
          <thead>
            <tr>
              <Th>Category</Th>
              <Th>Measure</Th>
              <Th>Notes</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td className="font-medium">Encryption in transit</Td>
              <Td>TLS 1.3 for all network traffic</Td>
              <Td>HSTS enforced; weak cipher suites disabled</Td>
            </tr>
            <tr>
              <Td className="font-medium">Encryption at rest</Td>
              <Td>AES-256-GCM with per-tenant keys</Td>
              <Td>
                Keys held in a managed key store; rotation on schedule and on
                suspicion of exposure
              </Td>
            </tr>
            <tr>
              <Td className="font-medium">Authentication</Td>
              <Td>
                Argon2id password hashing; WebAuthn passkeys; short-lived
                access tokens with rotating refresh tokens
              </Td>
              <Td>
                Session revocation available; SSO via OIDC or SAML 2.0 for
                enterprise tenants
              </Td>
            </tr>
            <tr>
              <Td className="font-medium">Authorization</Td>
              <Td>RBAC and ABAC enforced in middleware</Td>
              <Td>
                Least-privilege access; agent scopes enforced at the
                framework level, not in prompts
              </Td>
            </tr>
            <tr>
              <Td className="font-medium">Tenant isolation</Td>
              <Td>
                Row-level filtering enforced by a data-layer extension; row
                security policies for cellular deployments
              </Td>
              <Td>
                Adversarial cross-tenant tests run in CI; a missing filter
                fails closed
              </Td>
            </tr>
            <tr>
              <Td className="font-medium">Audit logging</Td>
              <Td>
                Append-only audit log for every state transition on cargo,
                declarations, and agent actions
              </Td>
              <Td>
                Append-only enforced by database role permission, not
                application convention
              </Td>
            </tr>
            <tr>
              <Td className="font-medium">Vulnerability management</Td>
              <Td>
                Dependency scanning, container image scanning, and regular
                penetration testing
              </Td>
              <Td>
                Security-relevant fixes prioritised by severity; critical
                vulnerabilities patched within 7 days
              </Td>
            </tr>
            <tr>
              <Td className="font-medium">Personnel security</Td>
              <Td>
                Background verification where lawful, confidentiality
                agreements, and annual data protection training
              </Td>
              <Td>
                Onboarding and offboarding procedures for all personnel with
                access to production systems
              </Td>
            </tr>
            <tr>
              <Td className="font-medium">Physical security</Td>
              <Td>
                Primary infrastructure hosted in ISO/IEC 27001 certified data
                centres
              </Td>
              <Td>
                Sub-processor physical controls subject to equivalent
                certification requirements
              </Td>
            </tr>
            <tr>
              <Td className="font-medium">Incident response</Td>
              <Td>
                24×7 detection; documented response procedures; defined
                escalation paths
              </Td>
              <Td>
                Breach notification timelines per Section 9 of this DPA
              </Td>
            </tr>
            <tr>
              <Td className="font-medium">Business continuity</Td>
              <Td>
                Continuous backup with point-in-time recovery; documented
                disaster recovery plan; regular restore testing
              </Td>
              <Td>
                Recovery time and recovery point objectives documented in the
                Service description
              </Td>
            </tr>
            <tr>
              <Td className="font-medium">Data minimisation</Td>
              <Td>
                Only data necessary for the subscribed functionality is
                processed
              </Td>
              <Td>
                Optional fields are not required; customers control the scope
                of what they submit
              </Td>
            </tr>
            <tr>
              <Td className="font-medium">
                AI and agent-specific controls
              </Td>
              <Td>
                LLM output treated as data, not instruction; agent scopes
                enforced in middleware; guardrails require human approval for
                high-stakes actions
              </Td>
              <Td>
                No customer Personal Data is sent to a third-party model
                provider without explicit per-tenant opt-in
              </Td>
            </tr>
          </tbody>
        </Table>
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
          Version {DPA_VERSION}
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
        Data Processing Agreement
      </h1>

      <p className="mt-4 max-w-2xl text-pretty text-muted-foreground">
        The terms under which TradeOps processes personal data on your behalf
        in the course of providing the Service. This DPA forms part of your
        agreement with {COMPANY.legalName}.
      </p>
    </header>
  );
}

function TableOfContents() {
  const sections = SECTIONS.filter((s) => s.kind !== 'schedule');
  const schedules = SECTIONS.filter((s) => s.kind === 'schedule');

  return (
    <nav
      aria-label="Table of contents"
      className="print:hidden lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto"
    >
      <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Contents
      </h2>
      <ol className="mt-4 space-y-1.5 text-sm">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="flex gap-2 rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {section.number && (
                <span className="tabular-nums text-muted-foreground/60">
                  {section.number}.
                </span>
              )}
              <span>{section.title}</span>
            </a>
          </li>
        ))}
      </ol>

      {schedules.length > 0 && (
        <>
          <h2 className="mt-6 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Schedules
          </h2>
          <ol className="mt-4 space-y-1.5 text-sm">
            {schedules.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="flex gap-2 rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <span className="tabular-nums text-muted-foreground/60">
                    {section.number}.
                  </span>
                  <span>{section.title.replace(/^Schedule [A-Z] — /, '')}</span>
                </a>
              </li>
            ))}
          </ol>
        </>
      )}
    </nav>
  );
}

function DpaSection({ section }: { section: Section }) {
  const isSchedule = section.kind === 'schedule';

  return (
    <section
      id={section.id}
      aria-labelledby={`${section.id}-heading`}
      className="scroll-mt-24"
    >
      <div className="flex flex-wrap items-center gap-3">
        {isSchedule ? (
          <span className="inline-flex items-center rounded-md border bg-muted/60 px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Schedule {section.number}
          </span>
        ) : section.number ? (
          <span className="tabular-nums text-muted-foreground/70">
            {section.number}.
          </span>
        ) : null}
      </div>

      <h2
        id={`${section.id}-heading`}
        className={
          isSchedule
            ? 'mt-2 text-xl font-semibold tracking-tight'
            : 'mt-1 text-lg font-semibold tracking-tight'
        }
      >
        {section.title}
      </h2>

      <div className="mt-4 space-y-4 text-sm leading-relaxed text-foreground/90 [&_p]:text-pretty">
        {section.body}
      </div>
    </section>
  );
}

export default function DPAPage() {
  return (
    <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[280px_1fr] lg:gap-12">
      <TableOfContents />
      <article className="prose prose-muted max-w-none">
        <DocumentHeader />
        {SECTIONS.map((section) => (
          <DpaSection key={section.id} section={section} />
        ))}
      </article>
    </div>
  );
}