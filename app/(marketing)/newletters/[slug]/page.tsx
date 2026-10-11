import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

/**
 * ============================================================================
 * NEWSLETTER ISSUE DETAIL
 * ============================================================================
 *
 * Dynamic route for individual newsletter issues. The page uses three
 * Next.js App Router conventions that are easy to get wrong:
 *
 *   1. `generateStaticParams` — pre-renders every issue at build time.
 *   2. `generateMetadata` — produces per-issue metadata for SEO and social
 *      sharing. Without this, every issue shares the site-level metadata.
 *   3. `params` is a Promise in Next.js 15+. Awaiting it is mandatory.
 *
 * The mock data at the top is illustrative. In production:
 *
 *   import { getIssue, getIssueSlugs, getRelatedIssues } from '@/lib/newsletters';
 *
 * `getIssue(slug)` should return the issue metadata plus `content` (compiled
 * MDX as a React node) and `toc` (headings extracted from the content).
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
  bio?: string;
};

type Topic = {
  id: string;
  name: string;
};

type TocEntry = {
  id: string;
  title: string;
  level: 2 | 3;
};

type Issue = {
  slug: string;
  issueNumber: number;
  title: string;
  subtitle?: string;
  excerpt: string;
  publishedAt: string;
  updatedAt?: string;
  contributor: Contributor;
  topic: Topic;
  tags: string[];
  readingTimeMinutes: number;
  coverImage?: { url: string; alt: string };
  content: React.ReactNode;
  toc: TocEntry[];
};

// ---------------------------------------------------------------------------
// Mock data — replace with `getIssue(slug)`, `getIssueSlugs()`, and
// `getRelatedIssues(slug)` from `@/lib/newsletters`
// ---------------------------------------------------------------------------

const CONTRIBUTORS: Record<string, Contributor> = {
  lim: {
    id: 'lim',
    name: 'Wei Lim',
    role: 'Head of Compliance',
    avatarUrl: '/contributors/wei-lim.jpg',
    href: '/contributors/wei-lim',
    bio: 'Wei leads compliance at TradeOps. He spent eleven years as a customs broker in Penang before joining, and writes about the operational side of trade regulation.',
  },
  tan: {
    id: 'tan',
    name: 'Aisha Tan',
    role: 'Engineering Lead',
    avatarUrl: '/contributors/aisha-tan.jpg',
    href: '/contributors/aisha-tan',
    bio: 'Aisha leads the platform engineering team. She writes about the trade-offs behind the infrastructure that keeps a customs platform running.',
  },
  rao: {
    id: 'rao',
    name: 'Priya Rao',
    role: 'Operations Director',
    avatarUrl: '/contributors/priya-rao.jpg',
    href: '/contributors/priya-rao',
    bio: 'Priya runs customer operations. She spends a week each quarter embedded with a customer team and writes about what she sees.',
  },
};

const ISSUES: Issue[] = [
  {
    slug: 'issue-042-customs-is-a-data-problem',
    issueNumber: 42,
    title: 'Customs is a data problem, not a paperwork problem',
    subtitle:
      'Every audit finding traces back to a fact that was true at one point and was never updated.',
    excerpt:
      'Every customs finding we have seen at audit traced back to the same root cause: a fact about a good that was true at one point and was never updated.',
    publishedAt: '2026-10-05',
    contributor: CONTRIBUTORS.lim,
    topic: { id: 'compliance', name: 'Trade compliance' },
    tags: ['audit', 'master-data', 'classification'],
    readingTimeMinutes: 8,
    coverImage: {
      url: '/newsletters/issue-042/cover.jpg',
      alt: 'A customs declaration form with an audit trail overlay',
    },
    toc: [
      { id: 'the-pattern', title: 'The pattern', level: 2 },
      { id: 'four-cases', title: 'Four cases', level: 2 },
      { id: 'what-it-costs', title: 'What it costs', level: 2 },
      { id: 'the-fix', title: 'The fix', level: 2 },
      { id: 'conclusion', title: 'Conclusion', level: 2 },
    ],
    content: (
      <>
        <p>
          Every customs finding we have seen at audit traced back to the same
          root cause: a fact about a good that was true at one point and was
          never updated. The classification was correct when it was filed.
          Then engineering changed a component. Or sourcing changed a
          supplier. Or the goods started arriving from a different origin
          port. The declaration continued to be filed against the old fact,
          and nobody noticed because the difference did not surface until a
          customs officer asked.
        </p>

        <h2 id="the-pattern">The pattern</h2>

        <p>
          The pattern is almost always the same. A fact enters the system at
          one point in time. That fact is used to make a declaration. The fact
          changes somewhere else in the business. The declaration continues to
          be filed against the old fact until an audit, a query, or a
          customer complaint surfaces the discrepancy.
        </p>

        <p>
          The reason this keeps happening is not that the operations team is
          careless. It is that the fact lives in one system, the declaration
          lives in another, and there is no mechanism that forces them to
          reconcile.
        </p>

        <h2 id="four-cases">Four cases</h2>

        <p>
          In the last eighteen months, we have seen this pattern in four
          distinct shapes, each with its own cost structure.
        </p>

        <h3>1. The BOM change</h3>

        <p>
          A manufacturer of consumer electronics redesigned a product. The
          new design used a different semiconductor, sourced from a different
          country. The HS classification of the finished good did not change,
          but the origin determination did. The origin declaration on the
          finished good was no longer accurate. Eight months of declarations
          were filed against the old origin before the discrepancy was found.
        </p>

        <h2 id="what-it-costs">What it costs</h2>

        <p>
          The cost of a data discrepancy is not the duty that was
          under-declared. It is the penalty, the interest, the audit cost, and
          the management time to respond to the finding. In the four cases
          above, the ratio of total cost to direct duty exposure ranged from
          4:1 to 12:1.
        </p>

        <h2 id="the-fix">The fix</h2>

        <p>
          The fix is not a policy. It is a system that treats the customs
          facts about a good as first-class data with a version history and a
          reconciliation requirement. Every time the fact changes, every
          affected declaration is identified and the filer is asked to
          reconcile.
        </p>

        <h2 id="conclusion">Conclusion</h2>

        <p>
          Customs compliance is often framed as a paperwork exercise. It is
          not. It is a data integrity exercise, and the paperwork is the audit
          trail that proves you did it.
        </p>
      </>
    ),
  },
  {
    slug: 'issue-041-cost-of-a-wrong-hs-code',
    issueNumber: 41,
    title: 'The real cost of a misclassified HS code',
    excerpt:
      'A wrong HS code is not just a wrong duty rate. It cascades into origin determination, preferential treatment, permit requirements, and control-list flags.',
    publishedAt: '2026-09-28',
    contributor: CONTRIBUTORS.lim,
    topic: { id: 'compliance', name: 'Trade compliance' },
    tags: ['hs-code', 'duty', 'risk'],
    readingTimeMinutes: 12,
    toc: [
      { id: 'the-cascade', title: 'The cascade', level: 2 },
      { id: 'quantifying', title: 'Quantifying the exposure', level: 2 },
      { id: 'conclusion', title: 'Conclusion', level: 2 },
    ],
    content: (
      <>
        <p>
          A wrong HS code is not just a wrong duty rate. It cascades into
          origin determination, preferential treatment, permit requirements,
          and control-list flags. The direct duty difference is often the
          smallest part of the exposure.
        </p>

        <h2 id="the-cascade">The cascade</h2>

        <p>
          When you classify a good at the wrong subheading, five downstream
          determinations inherit the error.
        </p>

        <h2 id="quantifying">Quantifying the exposure</h2>

        <p>
          The direct duty difference is the easiest number to compute and the
          least important. The penalty, interest, and audit cost usually
          dominate.
        </p>

        <h2 id="conclusion">Conclusion</h2>

        <p>
          Classification is the highest-leverage data element in the customs
          file. Getting it right, and keeping it right, is the single most
          effective investment a trade compliance team can make.
        </p>
      </>
    ),
  },
  {
    slug: 'issue-040-append-only-audit-log',
    issueNumber: 40,
    title: 'Why we made the audit log append-only at the database',
    excerpt:
      'Application-level immutability is a suggestion. Database-level immutability is a constraint.',
    publishedAt: '2026-09-19',
    contributor: CONTRIBUTORS.tan,
    topic: { id: 'engineering', name: 'Engineering' },
    tags: ['audit', 'postgres', 'architecture'],
    readingTimeMinutes: 6,
    toc: [
      { id: 'the-requirement', title: 'The requirement', level: 2 },
      { id: 'why-not-application', title: 'Why not application-level', level: 2 },
      { id: 'the-implementation', title: 'The implementation', level: 2 },
    ],
    content: (
      <>
        <p>
          Application-level immutability is a suggestion. Database-level
          immutability is a constraint. The difference matters when a customs
          officer asks whether the record could have been tampered with.
        </p>

        <h2 id="the-requirement">The requirement</h2>

        <p>
          The audit log is evidence. It is what we present to a customs
          officer or a court when the accuracy of a declaration is challenged.
        </p>

        <h2 id="why-not-application">Why not application-level</h2>

        <p>
          Application-level immutability means the code does not issue UPDATE
          or DELETE against the audit table. It is a convention. A future
          developer can break it by accident.
        </p>

        <h2 id="the-implementation">The implementation</h2>

        <p>
          We use Postgres role permissions to remove UPDATE and DELETE from
          the application role on the audit table. The application can INSERT
          and SELECT. It cannot modify history.
        </p>
      </>
    ),
  },
  {
    slug: 'issue-039-fiz-operators-day',
    issueNumber: 39,
    title: 'What a FIZ operator actually does all day',
    excerpt:
      'We shadowed three Free Industrial Zone operations teams for a week. The job is not what the software industry thinks it is.',
    publishedAt: '2026-09-12',
    contributor: CONTRIBUTORS.rao,
    topic: { id: 'operations', name: 'Operations' },
    tags: ['fiz', 'field-research', 'product'],
    readingTimeMinutes: 10,
    toc: [
      { id: 'what-we-expected', title: 'What we expected', level: 2 },
      { id: 'what-we-saw', title: 'What we saw', level: 2 },
      { id: 'what-we-changed', title: 'What we changed', level: 2 },
    ],
    content: (
      <>
        <p>
          We shadowed three Free Industrial Zone operations teams for a week.
          The job is not what the software industry thinks it is.
        </p>

        <h2 id="what-we-expected">What we expected</h2>

        <p>
          We expected to see a lot of spreadsheet work and a lot of manual
          data entry. We expected the pain to be in the software.
        </p>

        <h2 id="what-we-saw">What we saw</h2>

        <p>
          The pain was not in the software. It was in the coordination between
          the operations team and the compliance team, and in the handoffs
          between shifts.
        </p>

        <h2 id="what-we-changed">What we changed</h2>

        <p>
          We changed the design of the shift handover screen and added a
          compliance review queue that the operations team can see.
        </p>
      </>
    ),
  },
];

// ---------------------------------------------------------------------------
// Data functions
// ---------------------------------------------------------------------------

function getIssue(slug: string): Issue | null {
  return ISSUES.find((i) => i.slug === slug) ?? null;
}

function getRelatedIssues(slug: string, limit = 3): Issue[] {
  const current = getIssue(slug);
  if (!current) return [];
  return ISSUES.filter((i) => i.slug !== slug)
    .sort((a, b) => {
      const aScore =
        (a.topic.id === current.topic.id ? 10 : 0) +
        a.tags.filter((t) => current.tags.includes(t)).length;
      const bScore =
        (b.topic.id === current.topic.id ? 10 : 0) +
        b.tags.filter((t) => current.tags.includes(t)).length;
      return bScore - aScore;
    })
    .slice(0, limit);
}

function getAdjacentIssues(slug: string): {
  prev: Issue | null;
  next: Issue | null;
} {
  // Sorted by issue number ascending; "prev" means the older issue, "next"
  // means the newer issue.
  const sorted = [...ISSUES].sort((a, b) => a.issueNumber - b.issueNumber);
  const idx = sorted.findIndex((i) => i.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? sorted[idx - 1] : null,
    next: idx < sorted.length - 1 ? sorted[idx + 1] : null,
  };
}

// ---------------------------------------------------------------------------
// Static params
// ---------------------------------------------------------------------------

export function generateStaticParams() {
  return ISSUES.map((issue) => ({ slug: issue.slug }));
}

// ---------------------------------------------------------------------------
// Per-issue metadata
// ---------------------------------------------------------------------------

const BASE_URL = 'https://tradeops.example';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const issue = getIssue(slug);

  if (!issue) {
    return {
      title: 'Issue not found',
      robots: { index: false, follow: false },
    };
  }

  const url = `${BASE_URL}/newsletters/${issue.slug}`;
  const issueLabel = `Issue ${String(issue.issueNumber).padStart(3, '0')}`;
  const fullTitle = `${issue.title} — ${issueLabel}`;

  return {
    title: fullTitle,
    description: issue.excerpt,
    authors: [{ name: issue.contributor.name }],
    keywords: issue.tags,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: fullTitle,
      description: issue.excerpt,
      siteName: 'The TradeOps Dispatch',
      publishedTime: issue.publishedAt,
      modifiedTime: issue.updatedAt ?? issue.publishedAt,
      authors: [issue.contributor.name],
      tags: issue.tags,
      images: issue.coverImage
        ? [{ url: issue.coverImage.url, alt: issue.coverImage.alt }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: issue.excerpt,
      images: issue.coverImage ? [issue.coverImage.url] : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

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

function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M16 10H4M9 15l-5-5 5-5" />
    </svg>
  );
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m7 4 6 6-6 6" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

function Breadcrumb({ issue }: { issue: Issue }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <li>
          <Link
            href="/"
            className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Home
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronRightIcon className="h-3 w-3" />
        </li>
        <li>
          <Link
            href="/newsletters"
            className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Newsletters
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronRightIcon className="h-3 w-3" />
        </li>
        <li>
          <Link
            href={`/newsletters?topic=${issue.topic.id}`}
            className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {issue.topic.name}
          </Link>
        </li>
      </ol>
    </nav>
  );
}

function IssueHeader({ issue }: { issue: Issue }) {
  return (
    <header>
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

      <h1 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
        {issue.title}
      </h1>

      {issue.subtitle && (
        <p className="mt-4 text-pretty text-lg text-muted-foreground sm:text-xl">
          {issue.subtitle}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-4 border-t pt-6">
        <Link
          href={issue.contributor.href ?? `/contributors/${issue.contributor.id}`}
          className="group flex items-center gap-3 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {issue.contributor.avatarUrl ? (
            <span
              aria-hidden="true"
              className="h-10 w-10 overflow-hidden rounded-full border bg-muted"
              style={{
                backgroundImage: `url(${issue.contributor.avatarUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          ) : (
            <span
              aria-hidden="true"
              className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted text-xs font-medium text-muted-foreground"
            >
              {issue.contributor.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </span>
          )}
          <span className="text-sm">
            <span className="block font-medium transition-colors group-hover:text-foreground/80">
              {issue.contributor.name}
            </span>
            <span className="block text-xs text-muted-foreground">
              {issue.contributor.role}
            </span>
          </span>
        </Link>

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <time dateTime={issue.publishedAt}>
            {formatDate(issue.publishedAt)}
          </time>
          {issue.updatedAt && (
            <>
              <span aria-hidden="true">·</span>
              <span>
                Updated{' '}
                <time dateTime={issue.updatedAt}>
                  {formatDate(issue.updatedAt)}
                </time>
              </span>
            </>
          )}
          <span aria-hidden="true">·</span>
          <span>{issue.readingTimeMinutes} min read</span>
        </div>
      </div>

      {issue.coverImage && (
        <figure className="mt-10">
          <div
            aria-hidden="true"
            className="aspect-[16/9] w-full overflow-hidden rounded-xl border bg-gradient-to-br from-blue-500/20 via-transparent to-emerald-500/10"
            style={{
              backgroundImage: `url(${issue.coverImage.url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <figcaption className="mt-3 text-center text-xs text-muted-foreground">
            {issue.coverImage.alt}
          </figcaption>
        </figure>
      )}
    </header>
  );
}

function TableOfContents({ toc }: { toc: TocEntry[] }) {
  if (toc.length === 0) return null;

  return (
    <nav
      aria-label="In this issue"
      className="print:hidden lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto"
    >
      <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        In this issue
      </h2>
      <ol className="mt-4 space-y-1.5 text-sm">
        {toc.map((entry) => (
          <li
            key={entry.id}
            className={entry.level === 3 ? 'ml-4' : undefined}
          >
            <a
              href={`#${entry.id}`}
              className="block rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {entry.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function Tags({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;

  return (
    <div className="mt-10 flex flex-wrap gap-2 border-t pt-6">
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/newsletters?tag=${tag}`}
          className="inline-flex items-center rounded-full border bg-background px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {tag}
        </Link>
      ))}
    </div>
  );
}

function ContributorBio({ contributor }: { contributor: Contributor }) {
  if (!contributor.bio) return null;

  return (
    <aside className="mt-14 rounded-xl border bg-muted/20 p-6">
      <div className="flex items-start gap-4">
        {contributor.avatarUrl ? (
          <span
            aria-hidden="true"
            className="h-14 w-14 shrink-0 overflow-hidden rounded-full border bg-muted"
            style={{
              backgroundImage: `url(${contributor.avatarUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ) : (
          <span
            aria-hidden="true"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border bg-muted text-sm font-medium text-muted-foreground"
          >
            {contributor.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)}
          </span>
        )}
        <div className="min-w-0">
          <div className="text-sm font-medium">{contributor.name}</div>
          <div className="text-xs text-muted-foreground">
            {contributor.role}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {contributor.bio}
          </p>
          {contributor.href && (
            <Link
              href={contributor.href}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              All issues by {contributor.name.split(' ')[0]}
              <ArrowRightIcon className="h-3 w-3" />
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}

function IssueSubscribeCTA() {
  return (
    <aside className="mt-16 rounded-2xl border bg-gradient-to-br from-muted/60 to-background p-8 sm:p-10">
      <div className="max-w-xl">
        <h2 className="text-balance text-xl font-semibold tracking-tight">
          Get the next issue by email.
        </h2>
        <p className="mt-2 text-pretty text-sm text-muted-foreground">
          The TradeOps Dispatch is published every two weeks. No drip
          campaigns, no marketing, no sharing your address.
        </p>

        <form
          action="/api/newsletter/subscribe"
          method="POST"
          className="mt-5 flex flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="issue-subscribe-email" className="sr-only">
            Email address
          </label>
          <input
            id="issue-subscribe-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Subscribe
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-3 text-xs text-muted-foreground">
          Or subscribe via{' '}
          <Link
            href="/newsletters/rss.xml"
            className="underline underline-offset-4 hover:text-foreground"
          >
            RSS
          </Link>
          .
        </p>
      </div>
    </aside>
  );
}

function RelatedIssues({ issues }: { issues: Issue[] }) {
  if (issues.length === 0) return null;

  return (
    <section
      aria-labelledby="related-heading"
      className="mt-16 border-t pt-12"
    >
      <h2
        id="related-heading"
        className="text-lg font-semibold tracking-tight"
      >
        Related issues
      </h2>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {issues.map((issue) => (
          <article
            key={issue.slug}
            className="group flex flex-col rounded-xl border bg-background p-5 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-mono">
                {formatIssueNumber(issue.issueNumber)}
              </span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center rounded-md border bg-muted/40 px-2 py-0.5 font-medium">
                {issue.topic.name}
              </span>
            </div>
            <h3 className="mt-3 text-sm font-semibold leading-snug">
              <Link
                href={`/newsletters/${issue.slug}`}
                className="transition-colors hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {issue.title}
              </Link>
            </h3>
            <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground line-clamp-3">
              {issue.excerpt}
            </p>
            <div className="mt-4 border-t pt-3 text-xs text-muted-foreground">
              {issue.readingTimeMinutes} min read
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function AdjacentNav({
  prev,
  next,
}: {
  prev: Issue | null;
  next: Issue | null;
}) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Issue navigation"
      className="mt-16 grid gap-4 border-t pt-8 sm:grid-cols-2"
    >
      {prev ? (
        <Link
          href={`/newsletters/${prev.slug}`}
          className="group flex flex-col rounded-xl border bg-background p-5 transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ArrowLeftIcon className="h-3 w-3" />
            {formatIssueNumber(prev.issueNumber)}
          </span>
          <span className="mt-2 text-sm font-medium transition-colors group-hover:text-foreground/80">
            {prev.title}
          </span>
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}

      {next ? (
        <Link
          href={`/newsletters/${next.slug}`}
          className="group flex flex-col rounded-xl border bg-background p-5 text-right transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:items-end"
        >
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {formatIssueNumber(next.issueNumber)}
            <ArrowRightIcon className="h-3 w-3" />
          </span>
          <span className="mt-2 text-sm font-medium transition-colors group-hover:text-foreground/80">
            {next.title}
          </span>
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
    </nav>
  );
}

function StructuredData({ issue }: { issue: Issue }) {
  const url = `${BASE_URL}/newsletters/${issue.slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: issue.title,
    description: issue.excerpt,
    url,
    datePublished: issue.publishedAt,
    dateModified: issue.updatedAt ?? issue.publishedAt,
    author: {
      '@type': 'Person',
      name: issue.contributor.name,
      jobTitle: issue.contributor.role,
    },
    publisher: {
      '@type': 'Organization',
      name: 'TradeOps',
      url: BASE_URL,
    },
    image: issue.coverImage?.url
      ? `${BASE_URL}${issue.coverImage.url}`
      : undefined,
    keywords: issue.tags.join(', '),
    isPartOf: {
      '@type': 'PublicationVolume',
      name: 'The TradeOps Dispatch',
      volumeNumber: issue.issueNumber,
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
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const issue = getIssue(slug);

  if (!issue) {
    notFound();
  }

  const related = getRelatedIssues(issue.slug);
  const { prev, next } = getAdjacentIssues(issue.slug);
  const hasToc = issue.toc.length > 0;

  return (
    <main className="min-h-screen">
      <StructuredData issue={issue} />

      <article className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <Breadcrumb issue={issue} />

        <div className="mt-8">
          <IssueHeader issue={issue} />
        </div>

        <div
          className={
            hasToc
              ? 'mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-16'
              : 'mt-12'
          }
        >
          <div className="min-w-0">
            <div
              className={
                'prose prose-slate max-w-none dark:prose-invert ' +
                'prose-headings:scroll-mt-24 ' +
                'prose-headings:font-semibold prose-headings:tracking-tight ' +
                'prose-h2:mt-12 prose-h2:text-2xl ' +
                'prose-h3:mt-8 prose-h3:text-lg ' +
                'prose-p:text-pretty prose-p:leading-relaxed ' +
                'prose-a:underline prose-a:underline-offset-4 ' +
                'prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:text-sm prose-code:before:content-none prose-code:after:content-none ' +
                'prose-pre:overflow-x-auto prose-pre:rounded-lg prose-pre:border prose-pre:bg-muted/40 ' +
                'prose-blockquote:border-l-2 prose-blockquote:not-italic ' +
                'prose-table:text-sm'
              }
            >
              {issue.content}
            </div>

            <Tags tags={issue.tags} />
            <ContributorBio contributor={issue.contributor} />
            <IssueSubscribeCTA />
            <RelatedIssues issues={related} />
            <AdjacentNav prev={prev} next={next} />
          </div>

          {hasToc && (
            <aside className="lg:order-last">
              <TableOfContents toc={issue.toc} />
            </aside>
          )}
        </div>
      </article>
    </main>
  );
}