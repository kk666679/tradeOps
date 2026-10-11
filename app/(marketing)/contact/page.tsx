import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactForm } from './contact-form';
import { WhatsAppWidget } from './whatsapp-widget';
import { DiscordWidget } from './discord-widget';

/**
 * ============================================================================
 * ENVIRONMENT VARIABLES REQUIRED
 * ============================================================================
 *
 * Add these to your .env.local and to your deployment environment:
 *
 *   # WhatsApp Business
 *   NEXT_PUBLIC_WHATSAPP_NUMBER=60123456789
 *   NEXT_PUBLIC_WHATSAPP_MESSAGE=Hi, I would like to learn more about TradeOps
 *
 *   # Discord
 *   NEXT_PUBLIC_DISCORD_INVITE=https://discord.gg/your-invite-code
 *   NEXT_PUBLIC_DISCORD_SERVER_ID=123456789012345678
 *
 *   # Contact form
 *   CONTACT_RECIPIENT_EMAIL=hello@tradeops.example
 *   DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
 *   RESEND_API_KEY=re_...  (or your transactional email provider)
 *
 * Server-side-only variables (no NEXT_PUBLIC_ prefix) are never exposed to
 * the browser. The contact form submits through a Server Action so the
 * webhook URL and email API key stay on the server.
 * ============================================================================
 */

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

const BASE_URL = 'https://tradeops.example';
const PAGE_URL = `${BASE_URL}/contact`;
const PAGE_TITLE = 'Contact';
const PAGE_DESCRIPTION =
  'Talk to the TradeOps team about Free Zone, FIZ, FCZ, and bonded ' +
  'warehouse operations. Reach us on WhatsApp, Discord, email, or phone.';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
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
// Configuration — read from env, with safe fallbacks
// ---------------------------------------------------------------------------

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '60123456789';
const WHATSAPP_MESSAGE =
  process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ??
  'Hi, I would like to learn more about TradeOps.';
const DISCORD_INVITE =
  process.env.NEXT_PUBLIC_DISCORD_INVITE ?? 'https://discord.gg/tradeops';
const DISCORD_SERVER_ID =
  process.env.NEXT_PUBLIC_DISCORD_SERVER_ID ?? '';

const CONTACT_EMAIL = 'hello@tradeops.example';
const SALES_EMAIL = 'sales@tradeops.example';
const SUPPORT_EMAIL = 'support@tradeops.example';
const SUPPORT_PHONE = '+60 3-1234 5678';
const SUPPORT_PHONE_HREF = 'tel:+60312345678';

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

type Channel = {
  id: string;
  name: string;
  description: string;
  responseTime: string;
  href: string;
  external?: boolean;
  icon: React.ReactNode;
  accent: string;
};

type Office = {
  city: string;
  country: string;
  address: string[];
  timezone: string;
  isHQ?: boolean;
};

type FAQ = {
  question: string;
  answer: string;
};

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function DiscordIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function MailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 6 10-6" />
    </svg>
  );
}

function PhoneIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
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

function ExternalLinkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M11 3h6v6M17 3l-9 9M8 5H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-4" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Channels
// ---------------------------------------------------------------------------

const CHANNELS: readonly Channel[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    description:
      'Message us directly. Best for quick questions, pricing, and scheduling a demo.',
    responseTime: 'Typical response: under 2 hours during business hours',
    href: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`,
    external: true,
    icon: <WhatsAppIcon className="h-5 w-5" />,
    accent: 'text-emerald-600 dark:text-emerald-500',
  },
  {
    id: 'discord',
    name: 'Discord Community',
    description:
      'Join our server for technical discussions, release notes, and peer support.',
    responseTime: 'Community active 24×7 · staffed during business hours',
    href: DISCORD_INVITE,
    external: true,
    icon: <DiscordIcon className="h-5 w-5" />,
    accent: 'text-indigo-600 dark:text-indigo-400',
  },
  {
    id: 'email',
    name: 'Email',
    description:
      'For detailed enquiries, procurement, and formal correspondence.',
    responseTime: 'Typical response: within 1 business day',
    href: `mailto:${CONTACT_EMAIL}`,
    icon: <MailIcon className="h-5 w-5" />,
    accent: 'text-blue-600 dark:text-blue-400',
  },
  {
    id: 'phone',
    name: 'Phone',
    description:
      'For urgent operational matters and existing customers on a support plan.',
    responseTime: 'Business hours: 09:00–18:00 MYT, Mon–Fri',
    href: SUPPORT_PHONE_HREF,
    icon: <PhoneIcon className="h-5 w-5" />,
    accent: 'text-amber-600 dark:text-amber-500',
  },
];

const OFFICES: readonly Office[] = [
  {
    city: 'Kuala Lumpur',
    country: 'Malaysia',
    address: ['Level 20, Menara TradeOps', 'Jalan Sultan Ismail', '50250 Kuala Lumpur'],
    timezone: 'MYT (UTC+8)',
    isHQ: true,
  },
  {
    city: 'Singapore',
    country: 'Singapore',
    address: ['8 Marina View', '#21-05 Asia Square Tower 1', 'Singapore 018960'],
    timezone: 'SGT (UTC+8)',
  },
  {
    city: 'Port Klang',
    country: 'Malaysia',
    address: ['Free Zone Operations Centre', 'Pelabuhan Klang', '42000 Selangor'],
    timezone: 'MYT (UTC+8)',
  },
];

const FAQS: readonly FAQ[] = [
  {
    question: 'How quickly can we get a demo?',
    answer:
      'Most demos are scheduled within two business days. Message us on WhatsApp for the fastest response, or use the form below and we will get back to you within one business day.',
  },
  {
    question: 'Do you support multiple Free Zones in a single account?',
    answer:
      'Yes. Multi-zone tenancy is supported natively. Each zone can have its own policies, its own approval thresholds, and its own data residency configuration.',
  },
  {
    question: 'Can we migrate data from an existing WMS?',
    answer:
      'Yes. We provide import tooling for cargo, inventory, slot, customer, and document data. A typical migration is a phased cutover rather than a hard switch, and we run a reconciliation report before go-live.',
  },
  {
    question: 'Is the platform available on-premise?',
    answer:
      'The web tier deploys to Vercel or your own Kubernetes cluster. Workers run as long-lived processes in your infrastructure. Air-gapped deployments are supported for tenants that cannot use a hosted model provider.',
  },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Hero() {
  return (
    <header className="relative overflow-hidden border-b">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,theme(colors.blue.500/0.07),transparent)]"
      />
      <div className="mx-auto max-w-7xl px-4 pb-14 pt-20 sm:pt-24">
        <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          We reply within one business day
        </div>

        <h1 className="mt-6 max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Talk to the team.
        </h1>

        <p className="mt-5 max-w-2xl text-pretty text-lg text-muted-foreground">
          Whether you are evaluating a Free Zone platform, migrating from a
          legacy WMS, or need help with an existing deployment — reach us
          through the channel that suits you.
        </p>
      </div>
    </header>
  );
}

function Channels() {
  return (
    <section
      aria-labelledby="channels-heading"
      className="mx-auto max-w-7xl px-4 py-16"
    >
      <h2 id="channels-heading" className="sr-only">
        Contact channels
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {CHANNELS.map((channel) => {
          const isExternal = channel.external;
          const linkProps = isExternal
            ? { target: '_blank' as const, rel: 'noopener noreferrer' }
            : {};

          return (
            <a
              key={channel.id}
              href={channel.href}
              {...linkProps}
              className="group flex flex-col rounded-xl border bg-background p-6 transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <div
                className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border ${channel.accent}`}
              >
                {channel.icon}
              </div>

              <h3 className="mt-4 flex items-center gap-1.5 text-base font-semibold">
                {channel.name}
                {isExternal && (
                  <ExternalLinkIcon className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </h3>

              <p className="mt-2 flex-1 text-sm text-muted-foreground">
                {channel.description}
              </p>

              <p className="mt-4 border-t pt-3 text-xs text-muted-foreground">
                {channel.responseTime}
              </p>
            </a>
          );
        })}
      </div>
    </section>
  );
}

function WhatsAppAndDiscordWidgets() {
  return (
    <section
      aria-labelledby="widgets-heading"
      className="border-y bg-muted/20"
    >
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="max-w-2xl">
          <h2
            id="widgets-heading"
            className="text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            Start a conversation now.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Two ways to reach a human without filling in a form. The WhatsApp
            widget opens a chat with our team. The Discord widget shows who is
            online in our community server.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <WhatsAppWidget
            phoneNumber={WHATSAPP_NUMBER}
            defaultMessage={WHATSAPP_MESSAGE}
            businessName="TradeOps"
          />

          <DiscordWidget
            inviteUrl={DISCORD_INVITE}
            serverId={DISCORD_SERVER_ID}
            serverName="TradeOps Community"
          />
        </div>
      </div>
    </section>
  );
}

function ContactFormSection() {
  return (
    <section
      aria-labelledby="form-heading"
      className="mx-auto max-w-7xl px-4 py-16"
    >
      <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
        <div>
          <h2
            id="form-heading"
            className="text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            Send us a message.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Tell us about your operation and what you are trying to solve. The
            more specific you are, the more useful our first reply will be.
          </p>

          <dl className="mt-8 space-y-4 text-sm">
            <div>
              <dt className="font-medium">General enquiries</dt>
              <dd className="mt-1">
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-muted-foreground underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {CONTACT_EMAIL}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-medium">Sales and pricing</dt>
              <dd className="mt-1">
                <a
                  href={`mailto:${SALES_EMAIL}`}
                  className="text-muted-foreground underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {SALES_EMAIL}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-medium">Technical support</dt>
              <dd className="mt-1">
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="text-muted-foreground underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {SUPPORT_EMAIL}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-medium">Phone</dt>
              <dd className="mt-1">
                <a
                  href={SUPPORT_PHONE_HREF}
                  className="text-muted-foreground underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {SUPPORT_PHONE}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}

function Offices() {
  return (
    <section
      aria-labelledby="offices-heading"
      className="border-t bg-muted/20"
    >
      <div className="mx-auto max-w-7xl px-4 py-16">
        <h2
          id="offices-heading"
          className="text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          Where we are.
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {OFFICES.map((office) => (
            <article
              key={office.city}
              className="rounded-xl border bg-background p-6"
            >
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold">{office.city}</h3>
                {office.isHQ && (
                  <span className="rounded-full border bg-muted/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    HQ
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {office.country}
              </p>

              <address className="mt-4 not-italic text-sm text-foreground/90">
                {office.address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>

              <p className="mt-4 border-t pt-3 text-xs text-muted-foreground">
                {office.timezone}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQs() {
  return (
    <section
      aria-labelledby="faqs-heading"
      className="mx-auto max-w-7xl px-4 py-16"
    >
      <div className="max-w-2xl">
        <h2
          id="faqs-heading"
          className="text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          Common questions.
        </h2>
        <p className="mt-3 text-muted-foreground">
          If your question is not answered here, WhatsApp is the fastest way
          to get a human response.
        </p>
      </div>

      <dl className="mt-10 max-w-3xl divide-y">
        {FAQS.map((faq) => (
          <div key={faq.question} className="py-6 first:pt-0 last:pb-0">
            <dt className="text-sm font-medium">{faq.question}</dt>
            <dd className="mt-2 text-sm text-muted-foreground">
              {faq.answer}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function StructuredData() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'TradeOps',
    url: BASE_URL,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: SALES_EMAIL,
        availableLanguage: ['English', 'Malay', 'Chinese'],
      },
      {
        '@type': 'ContactPoint',
        contactType: 'technical support',
        email: SUPPORT_EMAIL,
        telephone: SUPPORT_PHONE,
        availableLanguage: ['English', 'Malay'],
      },
    ],
    address: OFFICES.map((office) => ({
      '@type': 'PostalAddress',
      addressLocality: office.city,
      addressCountry: office.country,
      streetAddress: office.address.join(', '),
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
      <Channels />
      <WhatsAppAndDiscordWidgets />
      <ContactFormSection />
      <Offices />
      <FAQs />
    </main>
  );
}