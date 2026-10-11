import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

/**
 * ============================================================================
 * NEWSLETTERS INDEX
 * ============================================================================
 *
 * This page lists newsletter issues with a featured issue, topic filter, and
 * a prominent subscribe form. The mock data at the top is illustrative; in
 * production it should be replaced by a call to `@/lib/newsletters`:
 *
 *   import { getIssues, getTopics } from '@/lib/newsletters';
 *
 * The content source is typically one of:
 *   - MDX files in a `content/newsletters/` directory, read with
 *     `next-mdx-remote` or `@next/mdx`
 *   - A CMS (Contentful, Sanity, Payload) queried at build time
 *   - A markdown collection read with Contentlayer or Velite
 *
 * `getIssues()` should return `IssueMeta[]` sorted by `publishedAt`
 * descending. `getTopics()` should return distinct topics with counts.
 *
 * The page is marked `force-static` because issues change only at publish
 * time. Topic filtering via `?topic=` still works because Next treats the
 * query string as a separate cache entry.
 * ============================================================================
 */

// ---------------------------------------------------------------------------
// Types — these belong in `@/lib/newsletters` in production
// ---------------------------------------------------------------------------

type Contributor = {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  href?: string;
};

type Topic = {
  id: string;
  name: string;
};

type IssueMeta = {
  slug: string;
  issueNumber: number;
  title: string;
  excerpt: string;
  publishedAt: string; // ISO 8601
  updatedAt?: string;
  contributor: Contributor;
  topic: Topic;
  tags: string[];
  readingTimeMinutes: number;
  featured?: boolean;
  coverImage?: { url: string; alt: string };
};

// ---------------------------------------------------------------------------
// Mock data — replace with `getIssues()` and `getTopics()` from
// `@/lib/newsletters`
// ---------------------------------------------------------------------------

const CONTRIBUTORS: Record<string, Contributor> = {
  lim: {
    id: 'lim',
    name: 'Wei Lim',
    role: 'Head of Compliance',
    avatarUrl: '/contributors/wei-lim.jpg',
    href: '/contributors/wei-lim',
  },
  tan: {
    id: 'tan',
    name: 'Aisha Tan',
    role: 'Engineering Lead',
    avatarUrl: '/contributors/aisha-tan.jpg',
    href: '/contributors/aisha-tan',
  },
  rao: {
    id: 'rao',
    name: 'Priya Rao',
    role: 'Operations Director',
    avatarUrl: '/contributors/priya-rao.jpg',
    href: '/contributors/priya-rao',
  },
};

const TOPICS: Topic[] = [
  { id: 'all', name: 'All issues' },
  { id: 'compliance', name: 'Trade compliance' },
  { id: 'operations', name: 'Operations' },
  { id: 'engineering', name: 'Engineering' },
  { id: 'product', name: 'Product' },
];

const ISSUES: IssueMeta[] = [
  {
    slug: 'issue-042-customs-is-a-data-problem',
    issueNumber: 42,
    title: 'Customs is a data problem, not a paperwork problem',
    excerpt:
      'Every customs finding we have seen at audit traced back to the same root cause: a fact about a good that was true at one point and was never updated. This issue walks through four cases and the pattern behind them.',
    publishedAt: '2026-10-05',
    contributor: CONTRIBUTORS.lim,
    topic: { id: 'compliance', name: 'Trade compliance' },
    tags: ['audit', 'master-data', 'classification'],
    readingTimeMinutes: 8,
    featured: true,
    coverImage: {
      url: '/newsletters/issue-042/cover.jpg',
      alt: 'A customs declaration form with an audit trail overlay',
    },
  },
  {
    slug: 'issue-041-cost-of-a-wrong-hs-code',
    issueNumber: 41,
    title: 'The real cost of a misclassified HS code',
    excerpt:
      'A wrong HS code is not just a wrong duty rate. It cascades into origin determination, preferential treatment, permit requirements, and control-list flags. Here is how to quantify the exposure for a real product line.',
    publishedAt: '2026-09-28',
    contributor: CONTRIBUTORS.lim,
    topic: { id: 'compliance', name: 'Trade compliance' },
    tags: ['hs-code', 'duty', 'risk'],
    readingTimeMinutes: 12,
  },
  {
    slug: 'issue-040-append-only-audit-log',
    issueNumber: 40,
    title: 'Why we made the audit log append-only at the database',
    excerpt:
      'Application-level immutability is a suggestion. Database-level immutability is a constraint. This is how we enforce the distinction, and why the difference matters when a customs officer asks whether the record could have been tampered with.',
    publishedAt: '2026-09-19',
    contributor: CONTRIBUTORS.tan,
    topic: { id: 'engineering', name: 'Engineering' },
    tags: ['audit', 'postgres', 'architecture'],
    readingTimeMinutes: 6,
  },
  {
    slug: 'issue-039-fiz-operators-day',
    issueNumber: 39,
    title: 'What a FIZ operator actually does all day',
    excerpt:
      'We shadowed three Free Industrial Zone operations teams for a week. The job is not what the software industry thinks it is. Here is what we saw, and what we changed in the product as a result.',
    publishedAt: '2026-09-12',
    contributor: CONTRIBUTORS.rao,
    topic: { id: 'operations', name: 'Operations' },
    tags: ['fiz', 'field-research', 'product'],
    readingTimeMinutes: 10,
  },
];

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

const BASE_URL = 'https://tradeops.example';
const PAGE_URL = `${BASE_URL}/newsletters`;
const PAGE_TITLE = 'Newsletters';
const PAGE_DESCRIPTION =
  'The TradeOps Dispatch — writing on customs compliance, Free Zone ' +
  'operations, and the engineering behind the platform. Published every ' +
  'two weeks.';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: PAGE_URL,
    types: {
      'application/rss+xml': `${BASE_URL}/newsletters/rss.xml`,
    },
  },
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
// Helpers
// ---------------------------------------------------------------------------

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatIssueNumber(n: number): string {
  return `Issue ${String(n).padStart(3, '0')}`;
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

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

function RssIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.36 20 6.18 20 5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18ZM4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27Zm0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93Z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

function Hero() {
  return (
    <header className="border-b">
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-20 sm:pt-24">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-full border bg-background px-2.5 py-0.5 font-medium">
            The TradeOps Dispatch
          </span>
          <span>·</span>
          <span>{ISSUES.length} issues</span>
        </div>

        <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Notes from the customs floor.
        </h1>

        <p className="mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
          A two-weekly dispatch on trade compliance, Free Zone operations, and
          the engineering behind a customs platform. Long-form, no fluff,
          sourced where it matters.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="#subscribe"
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Subscribe
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
          <Link
            href="/newsletters/rss.xml"
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <RssIcon className="h-4 w-4" />
            RSS
          </Link>
        </div>
      </div>
    </header>
  );
}

function FeaturedIssue({ issue }: { issue: IssueMeta }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border bg-background transition-shadow hover:shadow-lg">
      <div className="grid gap-0 md:grid-cols-2">
        <div className="relative aspect-[16/10] overflow-hidden bg-muted md:aspect-auto">
          {issue.coverImage && (
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-emerald-500/10"
            />
          )}
          <div className="absolute left-6 top-6">
            <span className="inline-flex items-center rounded-full border bg-background/90 px-3 py-1 text-xs font-medium backdrop-blur">
              Latest issue
            </span>
          </div>
        </div>

        <div className="flex flex-col p-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-mono text-muted-foreground">
              {formatIssueNumber(issue.issueNumber)}
            </span>
            <span aria-hidden="true">·</span>
            <Link
              href={`/newsletters?topic=${issue.topic.id}`}
              className="inline-flex items-center rounded-md border bg-muted/40 px-2 py-0.5 font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {issue.topic.name}
            </Link>
          </div>

          <h2 className="mt-4 text-2xl font-semibold tracking-tight">
            <Link
              href={`/newsletters/${issue.slug}`}
              className="transition-colors hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {issue.title}
            </Link>
          </h2>

          <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
            {issue.excerpt}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 border-t pt-6 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              {issue.contributor.name}
            </span>
            <span aria-hidden="true">·</span>
            <time dateTime={issue.publishedAt}>
              {formatDate(issue.publishedAt)}
            </time>
            <span aria-hidden="true">·</span>
            <span>{issue.readingTimeMinutes} min read</span>
          </div>

          <div className="mt-4">
            <Link
              href={`/newsletters/${issue.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Read this issue
              <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function TopicFilter({
  topics,
  activeTopic,
}: {
  topics: Topic[];
  activeTopic: string;
}) {
  return (
    <nav aria-label="Filter by topic" className="flex flex-wrap gap-2">
      {topics.map((topic) => {
        const isActive = topic.id === activeTopic;
        const href =
          topic.id === 'all'
            ? '/newsletters'
            : `/newsletters?topic=${topic.id}`;
        return (
          <Link
            key={topic.id}
            href={href}
            aria-current={isActive ? 'page' : undefined}
            className={
              isActive
                ? 'inline-flex items-center rounded-full border bg-foreground px-3 py-1.5 text-xs font-medium text-background'
                : 'inline-flex items-center rounded-full border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
            }
          >
            {topic.name}
          </Link>
        );
      })}
    </nav>
  );
}

function IssueCard({ issue }: { issue: IssueMeta }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border bg-background transition-shadow hover:shadow-md">
      <Link
        href={`/newsletters/${issue.slug}`}
        className="flex flex-1 flex-col p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <div className="flex items-center gap-2 text-xs">
          <span className="font-mono text-muted-foreground">
            {formatIssueNumber(issue.issueNumber)}
          </span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center rounded-md border bg-muted/40 px-2 py-0.5 font-medium text-muted-foreground">
            {issue.topic.name}
          </span>
        </div>

        <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight">
          <span className="transition-colors group-hover:text-foreground/80">
            {issue.title}
          </span>
        </h3>

        <p className="mt-3 flex-1 text-pretty text-sm leading-relaxed text-muted-foreground">
          {issue.excerpt}
        </p>

        <div className="mt-6 flex items-center justify-between border-t pt-4 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">
            {issue.contributor.name}
          </span>
          <time dateTime={issue.publishedAt}>
            {formatShortDate(issue.publishedAt)}
          </time>
        </div>
      </Link>
    </article>
  );
}

function IssueGrid({ issues }: { issues: IssueMeta[] }) {
  if (issues.length === 0) {
    return (
      <div className="rounded-xl border bg-muted/20 p-12 text-center">
        <p className="text-sm text-muted-foreground">
          No issues in this topic yet.
        </p>
        <Link
          href="/newsletters"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          View all issues
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {issues.map((issue) => (
        <IssueCard key={issue.slug} issue={issue} />
      ))}
    </div>
  );
}

function SubscribeCTA() {
  return (
    <div
      id="subscribe"
      className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-muted/60 to-background p-8 sm:p-12"
    >
      <div className="max-w-xl">
        <h2 className="text-balance text-2xl font-semibold tracking-tight">
          Get the next issue by email.
        </h2>
        <p className="mt-3 text-pretty text-sm text-muted-foreground">
          One email every two weeks. No drip campaigns, no marketing, no
          sharing your address. Unsubscribe with a single click.
        </p>

        <form
          action="/api/newsletter/subscribe"
          method="POST"
          className="mt-6 flex flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="flex-1 rounded-lg border bg-background px-3 py-2.5 text-sm shadow-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Subscribe
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-4 text-xs text-muted-foreground">
          Or subscribe via{' '}
          <Link
            href="/newsletters/rss.xml"
            className="underline underline-offset-4 hover:text-foreground"
          >
            RSS
          </Link>
          . Past issues are archived below.
        </p>
      </div>
    </div>
  );
}

function StructuredData({ issues }: { issues: IssueMeta[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'The TradeOps Dispatch',
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    publisher: {
      '@type': 'Organization',
      name: 'TradeOps',
      url: BASE_URL,
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: issues.slice(0, 10).map((issue, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        item: {
          '@type': 'Article',
          headline: issue.title,
          url: `${BASE_URL}/newsletters/${issue.slug}`,
          datePublished: issue.publishedAt,
          author: {
            '@type': 'Person',
            name: issue.contributor.name,
          },
          isPartOf: {
            '@type': 'PublicationVolume',
            name: 'The TradeOps Dispatch',
            volumeNumber: issue.issueNumber,
          },
        },
      })),
    },
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

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const { topic } = await searchParams;
  const activeTopic = topic ?? 'all';

  const filteredIssues =
    activeTopic === 'all'
      ? ISSUES
      : ISSUES.filter((i) => i.topic.id === activeTopic);

  const featured = filteredIssues.find((i) => i.featured);
  const rest = filteredIssues.filter((i) => i !== featured);

  return (
    <main className="min-h-screen">
      <StructuredData issues={ISSUES} />
      <Hero />

      <section
        aria-labelledby="issues-heading"
        className="mx-auto max-w-7xl px-4 py-14"
      >
        <h2 id="issues-heading" className="sr-only">
          Issues
        </h2>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <TopicFilter topics={TOPICS} activeTopic={activeTopic} />
        </div>

        {featured && (
          <div className="mt-10">
            <FeaturedIssue issue={featured} />
          </div>
        )}

        <div className="mt-10">
          <IssueGrid issues={rest} />
        </div>
      </section>

      <section
        aria-label="Newsletter subscription"
        className="mx-auto max-w-7xl px-4 pb-20"
      >
        <SubscribeCTA />
      </section>
    </main>
  );
}