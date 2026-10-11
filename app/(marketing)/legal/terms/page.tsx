import * as React from 'react';
import type { Metadata } from 'next';

/**
 * ============================================================================
 * TEMPLATE — NOT LEGAL ADVICE
 * ============================================================================
 *
 * This file is a structural template for a Terms of Service page. It is not
 * a substitute for legal review. Before publishing:
 *
 *   1. Have a qualified lawyer in your jurisdiction review every section.
 *   2. Replace all [BRACKETED PLACEHOLDERS] with your actual commercial terms.
 *   3. Confirm the governing-law clause matches your entity's incorporation.
 *   4. Confirm the liability cap is enforceable where you operate.
 *   5. Remove any section that does not apply to your product.
 *
 * Terms of Service are a binding contract. Shipping a template without
 * review creates legal exposure greater than having no terms at all,
 * because a defective clause is worse than an absent one.
 *
 * The "Regulatory Compliance" section below is product-specific to a customs
 * and Free Zone platform and is the section most likely to need tailoring.
 * ============================================================================
 */

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

const BASE_URL = 'https://tradeops.example';
const PAGE_URL = `${BASE_URL}/legal/terms`;
const PAGE_TITLE = 'Terms of Service';
const PAGE_DESCRIPTION =
  'The terms governing access to and use of the TradeOps platform for ' +
  'Free Industrial Zone, Free Commercial Zone, and bonded warehouse ' +
  'operations.';

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

const TERMS_VERSION = '1.0.0';
const EFFECTIVE_DATE = '2026-01-01';
const LAST_UPDATED = '2026-10-10';
const COMPANY = {
  legalName: '[COMPANY LEGAL NAME]',
  registrationNo: '[COMPANY REGISTRATION NUMBER]',
  address: '[REGISTERED ADDRESS]',
  country: 'Malaysia',
};
const GOVERNING_LAW = 'Malaysia';
const CONTACT_EMAIL = 'legal@tradeops.example';
const PRIVACY_EMAIL = 'privacy@tradeops.example';

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
// Section data — single source of truth for both the TOC and the body
// ---------------------------------------------------------------------------

type Section = {
  id: string;
  number: string;
  title: string;
  body: React.ReactNode;
};

const SECTIONS: readonly Section[] = [
  {
    id: 'acceptance',
    number: '1',
    title: 'Acceptance of Terms',
    body: (
      <>
        <p>
          These Terms of Service (the &ldquo;Terms&rdquo;) govern your access
          to and use of the TradeOps platform, including any related
          applications, APIs, documentation, and support services (together,
          the &ldquo;Service&rdquo;), provided by {COMPANY.legalName}{' '}
          (&ldquo;TradeOps&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or
          &ldquo;our&rdquo;).
        </p>
        <p>
          By accessing or using the Service, or by clicking to accept these
          Terms, you agree to be bound by them. If you are entering into these
          Terms on behalf of an organisation, you represent that you have the
          authority to bind that organisation, and &ldquo;you&rdquo; refers to
          that organisation.
        </p>
        <p>
          If you do not agree to these Terms, you must not access or use the
          Service.
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
          <dt className="font-medium text-foreground">&ldquo;Customer Data&rdquo;</dt>
          <dd className="text-muted-foreground">
            means any data, documents, or information that you or your
            authorised users submit to or generate within the Service,
            including shipment records, consignment details, customs
            declarations, and audit logs.
          </dd>
        </div>
        <div>
          <dt className="font-medium text-foreground">&ldquo;Free Zone&rdquo;</dt>
          <dd className="text-muted-foreground">
            means a Free Industrial Zone (FIZ), Free Commercial Zone (FCZ), or
            bonded warehouse under the jurisdiction of the relevant customs
            authority, as applicable to your use of the Service.
          </dd>
        </div>
        <div>
          <dt className="font-medium text-foreground">&ldquo;Tariff Data&rdquo;</dt>
          <dd className="text-muted-foreground">
            means the customs tariff rates, duty classifications, control
            flags, and related reference data made available through the
            Service.
          </dd>
        </div>
        <div>
          <dt className="font-medium text-foreground">&ldquo;Authorised User&rdquo;</dt>
          <dd className="text-muted-foreground">
            means an individual whom you permit to access the Service under
            your account, including your employees, contractors, and agents.
          </dd>
        </div>
      </dl>
    ),
  },
  {
    id: 'eligibility',
    number: '3',
    title: 'Eligibility and Account Registration',
    body: (
      <>
        <p>
          To use the Service, you must be at least eighteen (18) years old and
          capable of entering into a binding contract. The Service is offered
          to businesses and their authorised personnel, not to consumers.
        </p>
        <p>
          You must provide accurate, current, and complete information when
          registering, and keep that information up to date. You are
          responsible for:
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li>maintaining the confidentiality of your account credentials;</li>
          <li>all activity that occurs under your account;</li>
          <li>
            ensuring that each Authorised User complies with these Terms; and
          </li>
          <li>
            promptly notifying us of any unauthorised access or suspected
            security incident.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'subscription',
    number: '4',
    title: 'Subscription, Fees, and Payment',
    body: (
      <>
        <p>
          Access to the Service is provided on a subscription basis. Fees,
          billing frequency, and included usage limits are set out in your
          order form or subscription agreement.
        </p>
        <p>
          Unless stated otherwise in your order form: fees are quoted in{' '}
          [CURRENCY]; fees are exclusive of applicable taxes, duties, and
          levies; and fees are payable in advance.
        </p>
        <p>
          We may suspend or terminate your access to the Service if payment is
          not received within [NUMBER] days of the due date, following written
          notice.
        </p>
        <p>
          Fees are non-refundable except where required by law or expressly
          stated in these Terms.
        </p>
      </>
    ),
  },
  {
    id: 'acceptable-use',
    number: '5',
    title: 'Acceptable Use',
    body: (
      <>
        <p>You agree not to:</p>
        <ul className="ml-5 list-disc space-y-1">
          <li>
            use the Service in violation of any applicable law, including
            customs, export control, sanctions, and anti-money-laundering
            laws;
          </li>
          <li>
            submit false, misleading, or fraudulent information, including
            incorrect declarations or cargo descriptions;
          </li>
          <li>
            attempt to access data belonging to another customer of the
            Service;
          </li>
          <li>
            reverse engineer, decompile, or attempt to derive the source code
            of the Service;
          </li>
          <li>
            use the Service to transmit malware, conduct denial-of-service
            attacks, or interfere with the Service&rsquo;s operation;
          </li>
          <li>
            use automated means to access the Service except through our
            published APIs and within documented rate limits; or
          </li>
          <li>
            resell, sublicense, or provide the Service to third parties except
            as expressly permitted in your order form.
          </li>
        </ul>
        <p>
          We may suspend access to the Service where we reasonably believe a
          breach of this section presents an imminent risk to the Service,
          other customers, or third parties.
        </p>
      </>
    ),
  },
  {
    id: 'customer-data',
    number: '6',
    title: 'Customer Data',
    body: (
      <>
        <p>
          You retain all rights, title, and interest in your Customer Data. We
          do not acquire any ownership of it.
        </p>
        <p>
          You grant us a limited, non-exclusive licence to process Customer
          Data solely to provide the Service, to comply with legal
          obligations, and as otherwise described in our Privacy Policy.
        </p>
        <p>
          We will not access, use, or disclose Customer Data except: (a) as
          necessary to provide the Service; (b) as instructed by you; (c) as
          required by law; or (d) with your written consent.
        </p>
        <p>
          You are responsible for the accuracy, quality, and legality of
          Customer Data, and for obtaining any consents required to submit it
          to the Service.
        </p>
        <p>
          Data residency options, if any, are set out in your order form. Where
          you select a specific region, your Customer Data will be stored and
          processed within that region, subject to the exceptions described in
          our Privacy Policy.
        </p>
      </>
    ),
  },
  {
    id: 'regulatory',
    number: '7',
    title: 'Regulatory Compliance and Customs Obligations',
    body: (
      <>
        <p className="rounded-lg border-l-4 border-amber-500/60 bg-amber-500/[0.06] px-4 py-3 text-sm">
          This section is product-specific and should be reviewed by counsel
          familiar with customs and free-zone regulation in your operating
          jurisdictions.
        </p>

        <p className="mt-4">
          <strong className="font-medium">
            The Service is a tool, not a customs ruling.
          </strong>{' '}
          Tariff Data, HS classifications, duty calculations, control-flag
          determinations, and any other output of the Service are provided for
          informational and operational purposes only. They do not constitute
          a customs ruling, a legal opinion, or a substitute for professional
          advice.
        </p>

        <p>
          You are solely responsible for:
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li>
            verifying all Tariff Data and outputs against the current
            Customs Duties Order, Excise Duties Order, Sales Tax Orders, and
            any other applicable law before relying on them;
          </li>
          <li>
            the accuracy and completeness of every declaration, manifest, bill
            of lading, and other document you file with any customs authority;
          </li>
          <li>
            compliance with all customs, free-zone, export control, sanctions,
            and other regulatory obligations applicable to your operations;
          </li>
          <li>
            maintaining any licence, permit, bond, or authorisation required
            for your operations; and
          </li>
          <li>
            any duty, tax, penalty, fine, or other liability arising from your
            declarations, classifications, valuations, or origin determinations.
          </li>
        </ul>

        <p>
          We make no representation or warranty that any output of the Service
          is accurate, current, or complete as of the time you rely on it.
          Customs law and tariff schedules change frequently. You are
          responsible for confirming the current state of the law.
        </p>
      </>
    ),
  },
  {
    id: 'ip',
    number: '8',
    title: 'Intellectual Property',
    body: (
      <>
        <p>
          The Service, including all software, documentation, design,
          trademarks, and content (excluding Customer Data), is and remains
          the property of {COMPANY.legalName} and its licensors. Nothing in
          these Terms transfers any intellectual property rights to you.
        </p>
        <p>
          The Tariff Data is derived from public and government-published
          sources. The underlying facts are not subject to copyright; the
          curated compilation, annotations, and code are our property.
        </p>
        <p>
          If you provide feedback, suggestions, or feature requests, you grant
          us a perpetual, irrevocable, royalty-free licence to use them
          without attribution or compensation.
        </p>
      </>
    ),
  },
  {
    id: 'confidentiality',
    number: '9',
    title: 'Confidentiality',
    body: (
      <>
        <p>
          Each party may receive information that the other treats as
          confidential. Each party agrees to protect the other&rsquo;s
          confidential information with at least the same degree of care it
          uses for its own confidential information, and no less than
          reasonable care.
        </p>
        <p>
          Confidential information does not include information that is or
          becomes public through no fault of the receiving party, was already
          known to the receiving party, or is independently developed.
        </p>
        <p>
          A party may disclose confidential information where required by law,
          provided it gives the other party reasonable advance notice where
          permitted.
        </p>
      </>
    ),
  },
  {
    id: 'warranties',
    number: '10',
    title: 'Warranties and Disclaimers',
    body: (
      <>
        <p>
          We warrant that the Service will be provided with reasonable skill
          and care and will materially conform to its documentation.
        </p>
        <p className="uppercase tracking-wide text-sm font-medium">
          Except as expressly stated above, the Service is provided
          &ldquo;as is&rdquo; and &ldquo;as available&rdquo;. We disclaim all
          other warranties, whether express, implied, or statutory, including
          warranties of merchantability, fitness for a particular purpose,
          accuracy, and non-infringement.
        </p>
        <p>
          We do not warrant that the Service will be uninterrupted or
          error-free, that defects will be corrected, or that the Service will
          meet your specific requirements.
        </p>
      </>
    ),
  },
  {
    id: 'liability',
    number: '11',
    title: 'Limitation of Liability',
    body: (
      <>
        <p>
          To the maximum extent permitted by applicable law, neither party
          will be liable for any indirect, incidental, special, consequential,
          or punitive damages, including lost profits, lost revenue, lost
          data, or business interruption, arising out of or related to these
          Terms, even if advised of the possibility of such damages.
        </p>
        <p>
          Our aggregate liability arising out of or related to these Terms
          will not exceed [LIABILITY CAP — e.g. the fees paid by you in the
          twelve (12) months preceding the claim].
        </p>
        <p>
          Nothing in this section limits liability for: (a) death or personal
          injury caused by negligence; (b) fraud or fraudulent
          misrepresentation; (c) wilful misconduct; or (d) any liability that
          cannot be limited under applicable law.
        </p>
      </>
    ),
  },
  {
    id: 'indemnification',
    number: '12',
    title: 'Indemnification',
    body: (
      <>
        <p>
          You agree to indemnify, defend, and hold harmless {COMPANY.legalName}{' '}
          and its officers, directors, employees, and agents from any claim,
          liability, damage, loss, or expense (including reasonable legal
          fees) arising out of or related to:
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li>your use of the Service in violation of these Terms;</li>
          <li>
            any declaration, filing, or document you submit to a customs
            authority;
          </li>
          <li>your Customer Data; or</li>
          <li>your violation of any applicable law or third-party right.</li>
        </ul>
        <p>
          We will provide prompt notice of any such claim and reasonable
          cooperation in its defence, at your expense.
        </p>
      </>
    ),
  },
  {
    id: 'term',
    number: '13',
    title: 'Term and Termination',
    body: (
      <>
        <p>
          These Terms remain in effect for as long as you have access to the
          Service, or until terminated in accordance with this section.
        </p>
        <p>
          Either party may terminate these Terms for material breach if the
          breaching party fails to cure within thirty (30) days of written
          notice. We may suspend or terminate your access immediately if
          required by law or if your use presents a security or legal risk to
          the Service or third parties.
        </p>
        <p>
          On termination, your right to access the Service ends. We will make
          Customer Data available for export for [NUMBER] days following
          termination, after which we may delete it in accordance with our
          retention policy, subject to legal retention obligations.
        </p>
        <p>
          Sections that by their nature should survive termination will
          survive, including Sections 6, 7, 8, 9, 10, 11, 12, and 15.
        </p>
      </>
    ),
  },
  {
    id: 'modifications',
    number: '14',
    title: 'Modifications to these Terms',
    body: (
      <>
        <p>
          We may modify these Terms from time to time. If a modification is
          material, we will provide at least thirty (30) days&rsquo; notice by
          email or through the Service before it takes effect.
        </p>
        <p>
          Your continued use of the Service after the effective date of a
          modification constitutes acceptance of the modified Terms. If you do
          not agree to the modification, you may terminate your subscription
          in accordance with Section 13.
        </p>
        <p>
          The version number and last updated date are shown at the top of this
          page. We maintain a changelog of prior versions on request.
        </p>
      </>
    ),
  },
  {
    id: 'governing-law',
    number: '15',
    title: 'Governing Law and Dispute Resolution',
    body: (
      <>
        <p>
          These Terms are governed by the laws of {GOVERNING_LAW}, without
          regard to its conflict-of-laws principles.
        </p>
        <p>
          The parties will attempt in good faith to resolve any dispute
          arising out of or relating to these Terms through negotiation. If
          the dispute is not resolved within [NUMBER] days, it will be
          resolved by [DISPUTE RESOLUTION MECHANISM — e.g. the exclusive
          jurisdiction of the courts of {GOVERNING_LAW}, or arbitration under
          the rules of a named arbitral institution].
        </p>
        <p>
          Nothing in this section prevents either party from seeking interim
          or injunctive relief in any court of competent jurisdiction.
        </p>
      </>
    ),
  },
  {
    id: 'general',
    number: '16',
    title: 'General Provisions',
    body: (
      <dl className="space-y-3">
        <div>
          <dt className="font-medium text-foreground">Entire agreement</dt>
          <dd className="text-muted-foreground">
            These Terms, together with your order form and any policies
            referenced in them, constitute the entire agreement between the
            parties and supersede any prior agreement on the same subject.
          </dd>
        </div>
        <div>
          <dt className="font-medium text-foreground">Assignment</dt>
          <dd className="text-muted-foreground">
            You may not assign these Terms without our prior written consent.
            We may assign these Terms in connection with a merger,
            acquisition, or sale of substantially all our assets.
          </dd>
        </div>
        <div>
          <dt className="font-medium text-foreground">Severability</dt>
          <dd className="text-muted-foreground">
            If any provision of these Terms is held unenforceable, the
            remaining provisions will remain in full force and effect.
          </dd>
        </div>
        <div>
          <dt className="font-medium text-foreground">No waiver</dt>
          <dd className="text-muted-foreground">
            A party&rsquo;s failure to enforce any provision of these Terms is
            not a waiver of that provision or of any other provision.
          </dd>
        </div>
        <div>
          <dt className="font-medium text-foreground">Force majeure</dt>
          <dd className="text-muted-foreground">
            Neither party will be liable for failure to perform caused by
            events beyond its reasonable control.
          </dd>
        </div>
      </dl>
    ),
  },
  {
    id: 'contact',
    number: '17',
    title: 'Contact',
    body: (
      <>
        <p>
          Questions about these Terms may be directed to:
        </p>
        <dl className="mt-4 space-y-1 text-sm">
          <div className="flex gap-2">
            <dt className="min-w-32 text-muted-foreground">Legal entity</dt>
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
            <dt className="min-w-32 text-muted-foreground">Legal</dt>
            <dd>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {CONTACT_EMAIL}
              </a>
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="min-w-32 text-muted-foreground">Privacy</dt>
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
      </>
    ),
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TermsPage() {
  return (
    <article className="prose prose-zinc max-w-4xl mx-auto px-4 py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Terms of Service
        </h1>
        <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <div>
            <dt className="font-medium">Version</dt>
            <dd>{TERMS_VERSION}</dd>
          </div>
          <div>
            <dt className="font-medium">Effective</dt>
            <dd>{EFFECTIVE_DATE}</dd>
          </div>
          <div>
            <dt className="font-medium">Last updated</dt>
            <dd>{LAST_UPDATED}</dd>
          </div>
        </dl>
      </header>

      <nav className="mb-12 p-4 rounded-lg border bg-muted/50" aria-label="Table of contents">
        <h2 className="font-semibold mb-4">Contents</h2>
        <ol className="space-y-1">
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="text-sm hover:underline underline-offset-2"
              >
                {section.number}. {section.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="space-y-16">
        {SECTIONS.map((section) => (
          <section key={section.id} id={section.id} className="space-y-4">
            <header className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-muted-foreground/50">
                {section.number}
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                {section.title}
              </h2>
            </header>
            <div className="ml-10">{section.body}</div>
          </section>
        ))}
      </div>

      <footer className="mt-16 pt-8 border-t">
        <p className="text-sm text-muted-foreground text-center">
          © {new Date().getFullYear()} {COMPANY.legalName}. All rights reserved.
        </p>
      </footer>
    </article>
  );
}
