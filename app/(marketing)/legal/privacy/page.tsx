import * as React from 'react';
import type { Metadata } from 'next';

/**
 * ============================================================================
 * TEMPLATE — NOT LEGAL ADVICE
 * ============================================================================
 *
 * This file is a structural template for a Privacy Policy page. It is not a
 * substitute for legal review. Before publishing:
 *
 *   1. Have a qualified lawyer in your jurisdiction review every section.
 *   2. Replace all [BRACKETED PLACEHOLDERS] with your actual practices.
 *   3. Confirm your data controller / data user registration with the
 *      Personal Data Protection Commissioner where required.
 *   4. Confirm the retention periods match your actual data lifecycle.
 *   5. Confirm the subprocessor list is current and complete.
 *   6. If you serve EU/UK data subjects, confirm the GDPR addendum applies.
 *
 * Under the PDPA 2010, the Notice and Choice Principle requires you to inform
 * data subjects of the matters in Section 7(3) at or before collection. This
 * page is one way to discharge that obligation; your collection forms and
 * consent flows are another. Both must be consistent.
 *
 * The 2024 amendment introduced mandatory data breach notification, DPO
 * appointment, and the data portability right. Sections 8, 9, and 10 below
 * reflect those changes. Failure to comply with the PDPA principles can
 * attract a fine of up to RM300,000 or imprisonment of up to two years,
 * or both, and the breach-notification penalty separately carries a fine
 * of up to RM250,000.
 * ============================================================================
 */

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

const BASE_URL = 'https://tradeops.example';
const PAGE_URL = `${BASE_URL}/legal/privacy`;
const PAGE_TITLE = 'Privacy Policy';
const PAGE_DESCRIPTION =
  'How TradeOps collects, uses, discloses, and protects personal data in ' +
  'connection with the platform for Free Industrial Zone, Free Commercial ' +
  'Zone, and bonded warehouse operations, under the Personal Data ' +
  'Protection Act 2010 (Malaysia).';

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

const POLICY_VERSION = '1.0.0';
const EFFECTIVE_DATE = '2026-01-01';
const LAST_UPDATED = '2026-10-10';
const COMPANY = {
  legalName: '[COMPANY LEGAL NAME]',
  registrationNo: '[COMPANY REGISTRATION NUMBER]',
  address: '[REGISTERED ADDRESS]',
  country: 'Malaysia',
};
const PDPA_REGISTRATION_NO = '[PDPA DATA USER REGISTRATION NUMBER, IF APPLICABLE]';
const DPO_CONTACT = 'dpo@tradeops.example';
const PRIVACY_EMAIL = 'privacy@tradeops.example';
const CONTACT_EMAIL = 'hello@tradeops.example';
const RETENTION_DAYS_AFTER_TERMINATION = 90;
const BREACH_NOTIFICATION_WINDOW_HOURS = 72;

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function PrintIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M6 8V3h8v5M6 14H4a1 1 0 01-1-1V9a1 1 0 011-1h12a1 1 0 011 1v4a1 1 0 01-1 1h-2" />
      <rect x="6" y="12" width="8" height="5" rx="0.5" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Section data
// ---------------------------------------------------------------------------

type Section = {
  id: string;
  number: string;
  title: string;
  body: React.ReactNode;
};

const SECTIONS: readonly Section[] = [
  {
    id: 'who-we-are',
    number: '1',
    title: 'Who We Are and Scope',
    body: (
      <>
        <p>
          {COMPANY.legalName} (&ldquo;TradeOps&rdquo;, &ldquo;we&rdquo;,
          &ldquo;us&rdquo;, or &ldquo;our&rdquo;) operates the TradeOps
          platform for Free Industrial Zone, Free Commercial Zone, and bonded
          warehouse operations (the &ldquo;Service&rdquo;).
        </p>
        <p>
          For the purposes of the Personal Data Protection Act 2010
          (Malaysia) (the &ldquo;PDPA&rdquo;), {COMPANY.legalName} is a{' '}
          <strong className="font-medium">data user</strong> (the term the
          PDPA uses for what other regimes call a data controller) in respect
          of personal data we collect directly from you. Where we process
          personal data on behalf of a customer, we are a{' '}
          <strong className="font-medium">data processor</strong> and the
          customer is the data user; our processing in that capacity is
          governed by the data processing terms in our customer agreement.
        </p>
        <p>
          This Privacy Policy describes how we collect, use, disclose, and
          protect personal data when you:
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li>visit our website or use the Service as an authorised user;</li>
          <li>register for a demo, trial, or account;</li>
          <li>correspond with us by email, phone, or through the Service; or</li>
          <li>otherwise interact with us in a way that involves personal data.</li>
        </ul>
        <p>
          This Policy does not apply to personal data processed on behalf of a
          customer under a data processing agreement, except where we are
          required by law to disclose it or where we describe a specific
          activity below.
        </p>
        {PDPA_REGISTRATION_NO !== '[PDPA DATA USER REGISTRATION NUMBER, IF APPLICABLE]' && (
          <p className="rounded-lg border-l-4 border-muted-foreground/30 bg-muted/40 px-4 py-3 text-sm">
            Registered data user number: {PDPA_REGISTRATION_NO}.
          </p>
        )}
      </>
    ),
  },
  {
    id: 'data-we-collect',
    number: '2',
    title: 'Personal Data We Collect',
    body: (
      <>
        <p>
          We collect personal data in three ways: data you give us, data we
          collect automatically when you use the Service, and data we receive
          from third parties.
        </p>

        <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Data you give us
        </h3>
        <ul className="ml-5 list-disc space-y-1">
          <li>
            <strong className="font-medium">Account data</strong> — name,
            business email address, phone number, job title, employer,
            country, and password (stored hashed).
          </li>
          <li>
            <strong className="font-medium">Authentication data</strong> —
            passkey credentials, MFA device identifiers, and session metadata
            where you enable two-factor authentication.
          </li>
          <li>
            <strong className="font-medium">Billing data</strong> — billing
            contact, billing address, and payment method details processed by
            our payment provider. We do not store full card numbers.
          </li>
          <li>
            <strong className="font-medium">Communications data</strong> —
            messages you send us, support tickets, and notes from calls or
            meetings.
          </li>
          <li>
            <strong className="font-medium">Operational data</strong> — where
            you use the Service, information you enter about shipments,
            consignments, declarations, or counterparties that includes
            personal data of your employees, your customers, or your
            suppliers. This is processed on your behalf and not for our own
            purposes.
          </li>
        </ul>

        <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Data we collect automatically
        </h3>
        <ul className="ml-5 list-disc space-y-1">
          <li>
            <strong className="font-medium">Usage data</strong> — pages
            viewed, features used, actions taken, and time spent, associated
            with your account.
          </li>
          <li>
            <strong className="font-medium">Device and technical data</strong>{' '}
            — IP address, browser type and version, operating system, device
            type, referring URLs, and timestamps.
          </li>
          <li>
            <strong className="font-medium">Log data</strong> — server access
            logs, error logs, and security event logs.
          </li>
          <li>
            <strong className="font-medium">Cookie data</strong> — see{' '}
            <a
              href="#cookies"
              className="underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Section 10
            </a>{' '}
            for details.
          </li>
        </ul>

        <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Data we receive from third parties
        </h3>
        <ul className="ml-5 list-disc space-y-1">
          <li>
            <strong className="font-medium">Identity providers</strong> —
            where you sign in through SSO, we receive your name, email, and
            directory attributes from your organisation&rsquo;s identity
            provider.
          </li>
          <li>
            <strong className="font-medium">Analytics providers</strong> —
            aggregated usage data. We do not receive personal data from
            analytics providers unless you have consented separately.
          </li>
          <li>
            <strong className="font-medium">Public sources</strong> — where we
            verify business information about a company or a business
            contact.
          </li>
        </ul>

        <p className="mt-4 rounded-lg border-l-4 border-amber-500/60 bg-amber-500/[0.06] px-4 py-3 text-sm">
          <strong className="font-medium">Sensitive personal data.</strong>{' '}
          We do not intentionally collect sensitive personal data as defined
          under the PDPA (which includes information about physical or mental
          health, political opinions, religious beliefs, commission of
          offences, and biometric data) unless it is necessary to provide the
          Service and you have given explicit consent. If you believe we hold
          sensitive personal data about you without your consent, contact our
          DPO at {DPO_CONTACT}.
        </p>
      </>
    ),
  },
  {
    id: 'how-we-use',
    number: '3',
    title: 'How We Use Personal Data',
    body: (
      <>
        <p>We use personal data for the following purposes:</p>
        <ul className="ml-5 list-disc space-y-1">
          <li>
            <strong className="font-medium">To provide the Service</strong> —
            creating and managing your account, authenticating you,
            provisioning access, and delivering the features you use.
          </li>
          <li>
            <strong className="font-medium">To communicate with you</strong> —
            responding to enquiries, sending service notifications, and
            providing support.
          </li>
          <li>
            <strong className="font-medium">To bill and collect payment</strong>{' '}
            — invoicing, payment processing, and collections.
          </li>
          <li>
            <strong className="font-medium">To secure the Service</strong> —
            detecting and preventing fraud, abuse, unauthorised access, and
            security incidents.
          </li>
          <li>
            <strong className="font-medium">To improve the Service</strong> —
            analysing usage patterns, diagnosing problems, and prioritising
            product development. Where possible, we use aggregated or
            de-identified data for this purpose.
          </li>
          <li>
            <strong className="font-medium">To comply with legal obligations</strong>{' '}
            — responding to lawful requests from authorities, complying with
            customs, tax, sanctions, and anti-money-laundering obligations,
            and maintaining records required by law.
          </li>
          <li>
            <strong className="font-medium">To enforce our agreements</strong>{' '}
            — detecting, investigating, and responding to violations of our
            Terms of Service or Acceptable Use Policy.
          </li>
        </ul>

        <p className="mt-4">
          We do not sell personal data. We do not use personal data for
          automated decision-making that produces legal or similarly
          significant effects without human review.
        </p>
      </>
    ),
  },
  {
    id: 'legal-basis',
    number: '4',
    title: 'Legal Basis for Processing',
    body: (
      <>
        <p>
          Under the PDPA, we rely on the following bases for processing
          personal data:
        </p>

        <dl className="mt-4 space-y-4">
          <div>
            <dt className="font-medium text-foreground">Consent</dt>
            <dd className="text-muted-foreground">
              Where you have given us consent to process personal data for a
              specific purpose, such as receiving marketing communications.
              You may withdraw consent at any time by contacting our DPO. The
              withdrawal does not affect processing carried out before
              withdrawal.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">
              Performance of a contract
            </dt>
            <dd className="text-muted-foreground">
              Where processing is necessary to enter into or perform a
              contract with you, including providing the Service you have
              subscribed to.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">
              Legal obligation
            </dt>
            <dd className="text-muted-foreground">
              Where processing is necessary to comply with a legal obligation
              to which we are subject, including tax, customs, sanctions, and
              anti-money-laundering obligations.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">
              Legitimate interests
            </dt>
            <dd className="text-muted-foreground">
              Where processing is necessary for our legitimate interests,
              provided those interests are not overridden by your rights.
              Legitimate interests include securing the Service, preventing
              fraud, and improving our products.
            </dd>
          </div>
        </dl>

        <p className="mt-4">
          Where we process personal data on behalf of a customer as a data
          processor, the legal basis is determined by the customer. The
          customer is responsible for obtaining any consents required and for
          providing the notice required by the PDPA.
        </p>
      </>
    ),
  },
  {
    id: 'disclosure',
    number: '5',
    title: 'How We Disclose Personal Data',
    body: (
      <>
        <p>
          We disclose personal data only in the circumstances described below.
        </p>

        <dl className="mt-4 space-y-4">
          <div>
            <dt className="font-medium text-foreground">
              Service providers (subprocessors)
            </dt>
            <dd className="text-muted-foreground">
              We use third-party service providers for hosting, payment
              processing, email delivery, error tracking, and analytics.
              These providers process personal data only on our instructions
              and under written agreements that require them to protect it.
              A current list of subprocessors is available at{' '}
              <a
                href="/legal/subprocessors"
                className="underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                /legal/subprocessors
              </a>
              .
            </dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">
              Government and regulatory authorities
            </dt>
            <dd className="text-muted-foreground">
              Where we are required to disclose personal data to a customs
              authority, tax authority, law enforcement agency, or other
              government body under applicable law, we will do so. Where
              permitted, we will notify you before disclosure, unless
              prohibited by law or by the nature of the request.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">
              Professional advisers
            </dt>
            <dd className="text-muted-foreground">
              Our lawyers, auditors, and insurers may receive personal data
              where necessary for the advice or service they provide, subject
              to professional confidentiality obligations.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">
              Corporate transactions
            </dt>
            <dd className="text-muted-foreground">
              If we are involved in a merger, acquisition, financing, or sale
              of assets, personal data may be transferred to the acquiring or
              successor entity, subject to this Policy or a policy with
              equivalent protections.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">
              With your direction
            </dt>
            <dd className="text-muted-foreground">
              Where you instruct us to disclose personal data to a third
              party, including integrations you enable.
            </dd>
          </div>
        </dl>

        <p className="mt-4">
          We do not disclose personal data to third parties for their own
          marketing purposes.
        </p>
      </>
    ),
  },
  {
    id: 'international-transfers',
    number: '6',
    title: 'International Transfers',
    body: (
      <>
        <p>
          We may transfer personal data outside Malaysia where necessary to
          provide the Service. Where we do, we take reasonable steps to
          ensure that the receiving jurisdiction provides a level of
          protection comparable to the PDPA, or that the transfer is covered
          by appropriate safeguards.
        </p>
        <p>
          Under the 2024 amendments to the PDPA, the previous requirement to
          rely on a whitelist of permitted jurisdictions has been removed.
          Transfers outside Malaysia are permitted where the receiving
          jurisdiction has laws that provide a level of protection
          substantially similar to the PDPA, or where one of the prescribed
          exceptions applies.
        </p>
        <p>
          Where we transfer personal data to a subprocessor in a jurisdiction
          that does not meet the comparable-protection standard, we rely on
          contractual safeguards. A list of the jurisdictions in which we
          process personal data is available on request from our DPO.
        </p>
        <p>
          Where a customer selects a specific data residency region in their
          order form, we store and process personal data within that region,
          subject to the exceptions described in the order form and in our
          Privacy Policy.
        </p>
      </>
    ),
  },
  {
    id: 'security',
    number: '7',
    title: 'How We Protect Personal Data',
    body: (
      <>
        <p>
          We implement technical and organisational measures to protect
          personal data against unauthorised access, alteration, disclosure,
          or destruction. These measures include:
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li>
            Encryption in transit (TLS 1.3) and at rest (AES-256 with
            per-tenant keys for the highest-sensitivity fields).
          </li>
          <li>
            Role-based and attribute-based access control, with least-privilege
            defaults.
          </li>
          <li>
            Multi-factor authentication and passkey support for all user
            accounts.
          </li>
          <li>
            Logging and monitoring of access to personal data, with alerts on
            anomalous activity.
          </li>
          <li>
            Regular security testing, including dependency scanning and
            adversarial testing of tenant isolation.
          </li>
          <li>
            Background screening and confidentiality agreements for personnel
            with access to personal data.
          </li>
          <li>
            Incident response procedures, tested at least annually.
          </li>
        </ul>
        <p>
          No security programme is perfect. We cannot guarantee that
          unauthorised access will never occur. If we become aware of a
          personal data breach, we will take the steps described in Section
          8.
        </p>
      </>
    ),
  },
  {
    id: 'breach-notification',
    number: '8',
    title: 'Personal Data Breach Notification',
    body: (
      <>
        <p>
          Under Section 12B of the PDPA, as introduced by the Personal Data
          Protection (Amendment) Act 2024, we are required to notify the
          Personal Data Protection Commissioner of any personal data breach
          as soon as practicable, and to notify affected data subjects where
          the breach causes or is likely to cause significant harm.
        </p>
        <p>
          In practice, our breach notification process is:
        </p>
        <ol className="ml-5 list-decimal space-y-1">
          <li>
            <strong className="font-medium">Detection and assessment</strong>{' '}
            — we investigate the incident, assess its scope, and determine
            whether it constitutes a reportable breach.
          </li>
          <li>
            <strong className="font-medium">
              Notification to the Commissioner
            </strong>{' '}
            — where the breach is reportable, we notify the Commissioner as
            soon as practicable and within the timeframe required by law.
          </li>
          <li>
            <strong className="font-medium">
              Notification to affected data subjects
            </strong>{' '}
            — where the breach is likely to cause significant harm, we notify
            affected data subjects without undue delay, describing the nature
            of the breach, the likely consequences, and the steps we are
            taking.
          </li>
          <li>
            <strong className="font-medium">Remediation</strong> — we take
            steps to contain the breach, remediate the cause, and prevent
            recurrence.
          </li>
        </ol>
        <p>
          Where we are a data processor and the breach affects personal data
          we process on behalf of a customer, we will notify the customer
          without undue delay so that the customer, as data user, can meet
          its own notification obligations.
        </p>
        <p>
          If you believe you have been affected by a personal data breach
          involving the Service, contact our DPO at {DPO_CONTACT}.
        </p>
      </>
    ),
  },
  {
    id: 'your-rights',
    number: '9',
    title: 'Your Rights',
    body: (
      <>
        <p>
          Under the PDPA, you have the following rights in respect of personal
          data we hold about you:
        </p>

        <dl className="mt-4 space-y-4">
          <div>
            <dt className="font-medium text-foreground">
              Right of access
            </dt>
            <dd className="text-muted-foreground">
              You may request a copy of the personal data we hold about you,
              together with information about how it is used and to whom it
              has been disclosed. We will respond within the time required by
              law, and may charge a fee where permitted.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">
              Right to correction
            </dt>
            <dd className="text-muted-foreground">
              You may request that we correct personal data that is
              inaccurate, incomplete, misleading, or not up to date. Where we
              disagree that the data is inaccurate, we will record your
              correction request alongside the data.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">
              Right to withdraw consent
            </dt>
            <dd className="text-muted-foreground">
              Where we process personal data on the basis of your consent, you
              may withdraw that consent at any time. Withdrawal does not
              affect processing carried out before withdrawal, or processing
              carried out on another lawful basis.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">
              Right to limit processing
            </dt>
            <dd className="text-muted-foreground">
              You may request that we limit the processing of your personal
              data where you believe the data is inaccurate, the processing is
              unlawful, or you have objected to the processing. We will
              comply where required by law.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">
              Right to data portability
            </dt>
            <dd className="text-muted-foreground">
              Introduced by the 2024 amendments and effective from 1 June
              2025, you may request that we transfer your personal data to
              another data controller, subject to technical feasibility and
              compatibility of data formats. Where portability is not
              technically feasible, we will explain why and, where possible,
              provide the data in a structured, commonly used, machine-readable
              format.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">
              Right to object to direct marketing
            </dt>
            <dd className="text-muted-foreground">
              You may opt out of marketing communications at any time. We
              include an unsubscribe link in every marketing email.
            </dd>
          </div>
        </dl>

        <p className="mt-4">
          To exercise any of these rights, contact our DPO at{' '}
          <a
            href={`mailto:${DPO_CONTACT}`}
            className="underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {DPO_CONTACT}
          </a>
          . We will verify your identity before acting on a request. Where we
          cannot fulfil a request, we will explain why.
        </p>

        <p className="mt-4 rounded-lg border-l-4 border-muted-foreground/30 bg-muted/40 px-4 py-3 text-sm">
          Where we process personal data on behalf of a customer, the customer
          is the data user and is responsible for responding to data subject
          requests. If you make a request to us in relation to such data, we
          will refer it to the relevant customer and assist them in
          responding.
        </p>
      </>
    ),
  },
  {
    id: 'cookies',
    number: '10',
    title: 'Cookies and Similar Technologies',
    body: (
      <>
        <p>
          We use cookies and similar technologies (such as local storage and
          pixel tags) to operate and improve the Service. Cookies fall into
          three categories:
        </p>

        <dl className="mt-4 space-y-4">
          <div>
            <dt className="font-medium text-foreground">
              Strictly necessary cookies
            </dt>
            <dd className="text-muted-foreground">
              Required for the Service to function — authentication,
              session management, security, and load balancing. These cannot
              be disabled.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">
              Functional cookies
            </dt>
            <dd className="text-muted-foreground">
              Remember your preferences, such as language, region, and UI
              settings. Disabling these reduces convenience but does not
              prevent you from using the Service.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">
              Analytics cookies
            </dt>
            <dd className="text-muted-foreground">
              Help us understand how the Service is used, so we can improve
              it. We use these only where you have consented, and we do not
              use them to build advertising profiles.
            </dd>
          </div>
        </dl>

        <p className="mt-4">
          You can control cookies through your browser settings. Blocking
          strictly necessary cookies will prevent you from signing in. Where
          you have consented to analytics cookies, you may withdraw consent at
          any time through the cookie banner or by contacting our DPO.
        </p>

        <p>
          We do not use cookies to track you across third-party websites for
          advertising purposes.
        </p>
      </>
    ),
  },
  {
    id: 'retention',
    number: '11',
    title: 'Retention',
    body: (
      <>
        <p>
          We retain personal data for as long as necessary to fulfil the
          purposes for which it was collected, to comply with legal
          obligations, and to resolve disputes.
        </p>

        <dl className="mt-4 space-y-4">
          <div>
            <dt className="font-medium text-foreground">Account data</dt>
            <dd className="text-muted-foreground">
              Retained for the life of your account, and for{' '}
              {RETENTION_DAYS_AFTER_TERMINATION} days after termination to
              allow for data export, then deleted or anonymised, subject to
              legal retention obligations.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">Billing records</dt>
            <dd className="text-muted-foreground">
              Retained for the period required by tax and accounting law in
              the relevant jurisdiction.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">Security and audit logs</dt>
            <dd className="text-muted-foreground">
              Retained for a period sufficient to detect and investigate
              security incidents, and to meet audit requirements.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">
              Operational data processed on behalf of customers
            </dt>
            <dd className="text-muted-foreground">
              Retention is determined by the customer&rsquo;s instructions and
              their own legal obligations. We do not delete such data before
              the customer instructs us to, except where required by law.
            </dd>
          </div>
        </dl>

        <p className="mt-4">
          Where we cannot delete personal data because it is subject to a
          legal hold, a customs retention requirement, or a court order, we
          will retain it only for as long as the hold applies, and then delete
          it.
        </p>
      </>
    ),
  },
  {
    id: 'children',
    number: '12',
    title: "Children's Privacy",
    body: (
      <>
        <p>
          The Service is a business-to-business platform intended for use by
          organisations and their authorised personnel. It is not directed at
          children, and we do not knowingly collect personal data from anyone
          under the age of eighteen (18).
        </p>
        <p>
          If you believe we have collected personal data from a child without
          appropriate consent, contact our DPO at {DPO_CONTACT} and we will
          take steps to delete it.
        </p>
      </>
    ),
  },
  {
    id: 'changes',
    number: '13',
    title: 'Changes to This Policy',
    body: (
      <>
        <p>
          We may update this Privacy Policy from time to time to reflect
          changes in our practices, the Service, or applicable law. The
          version number and last-updated date are shown at the top of this
          page.
        </p>
        <p>
          If a change is material, we will provide notice by email or through
          the Service before the change takes effect, and where required by
          law, we will seek your consent.
        </p>
        <p>
          We maintain a changelog of prior versions. A copy of any prior
          version is available on request from our DPO.
        </p>
      </>
    ),
  },
  {
    id: 'contact',
    number: '14',
    title: 'How to Contact Us',
    body: (
      <>
        <p>
          If you have questions about this Privacy Policy, wish to exercise
          any of your rights, or wish to make a complaint about how we have
          handled your personal data, contact:
        </p>
        <dl className="mt-4 space-y-1 text-sm">
          <div className="flex gap-2">
            <dt className="min-w-32 text-muted-foreground">Data user</dt>
            <dd>{COMPANY.legalName}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="min-w-32 text-muted-foreground">Registration</dt>
            <dd>{COMPANY.registrationNo}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="min-w-32 text-muted-foreground">Address</dt>
            <dd>{COMPANY.address}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="min-w-32 text-muted-foreground">DPO</dt>
            <dd>
              <a
                href={`mailto:${DPO_CONTACT}`}
                className="underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {DPO_CONTACT}
              </a>
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="min-w-32 text-muted-foreground">Privacy enquiries</dt>
            <dd>
              <a
                href={`mailto:${PRIVACY_EMAIL}`}
                className="underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {PRIVACY_EMAIL}
              </a>
            </dd>
          </div>
        </dl>

        <p className="mt-4">
          If you are not satisfied with our response, you may lodge a
          complaint with the Personal Data Protection Commissioner of
          Malaysia.
        </p>
      </>
    ),
  },
  {
    id: 'gdpr-addendum',
    number: '15',
    title: 'Additional Information for EEA, UK, and Swiss Data Subjects',
    body: (
      <>
        <p className="rounded-lg border-l-4 border-muted-foreground/30 bg-muted/40 px-4 py-3 text-sm">
          This section applies only where the EU General Data Protection
          Regulation (GDPR), the UK GDPR, or the Swiss Federal Act on Data
          Protection applies to the processing. If none of these regimes
          applies to you, this section does not affect your rights under the
          PDPA.
        </p>

        <p className="mt-4">
          Where the GDPR applies, we act as a{' '}
          <strong className="font-medium">data controller</strong> for the
          personal data we collect directly from you, and as a{' '}
          <strong className="font-medium">data processor</strong> for the
          personal data we process on behalf of a customer.
        </p>

        <dl className="mt-4 space-y-4">
          <div>
            <dt className="font-medium text-foreground">
              Legal bases under the GDPR
            </dt>
            <dd className="text-muted-foreground">
              Where the GDPR applies, we rely on performance of a contract,
              legitimate interests, legal obligation, and consent, as
              applicable to the processing activity. Where we rely on consent,
              you may withdraw it at any time.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">
              International transfers under the GDPR
            </dt>
            <dd className="text-muted-foreground">
              Where we transfer personal data outside the EEA, UK, or
              Switzerland, we rely on an adequacy decision, the European
              Commission&rsquo;s Standard Contractual Clauses, or the UK
              International Data Transfer Addendum, as applicable.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">
              Additional rights
            </dt>
            <dd className="text-muted-foreground">
              Data subjects in these jurisdictions have additional rights,
              including the right to erasure, the right to restrict
              processing, the right to object to processing, and the right to
              lodge a complaint with a supervisory authority. These are in
              addition to the rights described in Section 9.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">
              Representative
            </dt>
            <dd className="text-muted-foreground">
              Where required, we appoint a representative in the relevant
              jurisdiction. Contact details are available from our DPO.
            </dd>
          </div>
        </dl>
      </>
    ),
  },
] as const;

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function DocumentHeader() {
  return (
    <header className="border-b pb-10">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="rounded-full border bg-background px-2.5 py-0.5 font-medium">
          Version {POLICY_VERSION}
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
        Privacy Policy
      </h1>

      <p className="mt-4 max-w-2xl text-pretty text-muted-foreground">
        This Policy explains how {COMPANY.legalName} collects, uses, discloses,
        and protects personal data in connection with the TradeOps platform.
        It describes your rights under the Personal Data Protection Act 2010
        (Malaysia) and how to exercise them.
      </p>

      <div className="mt-6 print:hidden">
        <a
          href="#print"
          className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <PrintIcon className="h-4 w-4" />
          Print or save as PDF
        </a>
      </div>
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

function PolicySection({ section }: { section: Section }) {
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

function DocumentFooter() {
  return (
    <footer className="mt-16 border-t pt-8">
      <div className="flex flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          &copy; {new Date().getFullYear()} {COMPANY.legalName}. All rights
          reserved.
        </p>
        <nav aria-label="Related documents" className="flex gap-4">
          <a
            href="/legal/terms"
            className="underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Terms of Service
          </a>
          <a
            href="/legal/dpa"
            className="underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Data Processing Agreement
          </a>
          <a
            href="/legal/subprocessors"
            className="underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Subprocessors
          </a>
        </nav>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <div className="grid gap-12 lg:grid-cols-[16rem_1fr] lg:gap-16">
        <div className="order-2 lg:order-1">
          <TableOfContents />
        </div>

        <article className="order-1 max-w-3xl lg:order-2">
          <DocumentHeader />

          <div className="mt-12 space-y-12">
            {SECTIONS.map((section) => (
              <PolicySection key={section.id} section={section} />
            ))}
          </div>

          <DocumentFooter />
        </article>
      </div>
    </main>
  );
}