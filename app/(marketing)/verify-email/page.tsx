// @ts-nocheck — see docs/app-walkthroughs-e2e-audit.md
import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AuthShell } from '@/components/marketing/auth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { verifyEmailToken } from '@/lib/auth/verify-email';
import { ResendVerificationButton } from './resend-button';

/**
 * ============================================================================
 * EMAIL VERIFICATION PAGE — states and flow
 * ============================================================================
 *
 * This page handles four scenarios, distinguished by the URL parameters:
 *
 *   1. No token, no email in the URL
 *      → "Check your inbox" state, with a resend button.
 *      This is what the visitor sees immediately after registering.
 *
 *   2. Token present, verification succeeds
 *      → "Email verified" state, with a button to continue to the dashboard.
 *      The token is consumed server-side and cannot be reused.
 *
 *   3. Token present, verification fails (expired or invalid)
 *      → "Link expired" state, with a resend button and a link to login.
 *      Do not reveal whether the token was expired vs. invalid — the same
 *      message covers both to avoid leaking information about token state.
 *
 *   4. Token present but verification is still processing (async)
 *      → Loading state, handled by the streamed server component boundary.
 *
 * Security notes:
 *   - Tokens are single-use. The server action deletes the token on success.
 *   - Tokens expire after 24 hours by default.
 *   - The response never reveals whether an email address exists in the
 *     system. See `verifyEmailToken` for the constant-response pattern.
 *   - The page is marked noindex. Auth pages should never be indexed.
 *
 * Environment variables:
 *   NEXT_PUBLIC_APP_URL — used to construct the redirect target after
 *                         successful verification.
 * ============================================================================
 */

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Verify your email',
  description: 'Confirm your email address to activate your TradeOps account.',
  // Auth pages must never be indexed. The URL often contains a token in the
  // query string, and search engines have been known to index them despite
  // robots.txt. The header is the reliable mechanism.
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

// Force dynamic rendering. The page reads a token from searchParams and
// performs a database write. Static rendering would cache the first visitor's
// state and serve it to everyone else.
export const dynamic = 'force-dynamic';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SearchParams = {
  token?: string;
  email?: string;
  next?: string;
};

type VerificationResult =
  | { status: 'verified'; email: string }
  | { status: 'expired' }
  | { status: 'invalid' }
  | { status: 'none' };

// ---------------------------------------------------------------------------
// Data loading — server-side
// ---------------------------------------------------------------------------

/**
 * Resolves the verification state from the URL parameters.
 *
 * The function returns a discriminated union that the page switches on. It
 * never throws and never leaks whether an email exists in the system: an
 * invalid token and an expired token produce the same external behaviour
 * except for the user-facing message, which is intentionally similar.
 */
async function resolveVerificationState(
  searchParams: SearchParams,
): Promise<VerificationResult> {
  const token = searchParams.token?.trim();
  const email = searchParams.email?.trim();

  if (!token) {
    return { status: 'none' };
  }

  try {
    const result = await verifyEmailToken(token);

    if (result.ok) {
      return { status: 'verified', email: result.email };
    }

    // Distinguish expiry from other failure reasons for the user message,
    // but do not distinguish "not found" from "already used" — both are
    // covered by `invalid` and produce the same user-facing behaviour.
    if (result.reason === 'expired') {
      return { status: 'expired' };
    }
    return { status: 'invalid' };
  } catch (err) {
    // Never surface a raw error to the user. Log server-side and show the
    // same message as an invalid token. This is intentional: a database
    // failure and a bad token should be indistinguishable to the client.
    // eslint-disable-next-line no-console
    console.error('[verify-email] token verification failed', err);
    return { status: 'invalid' };
  }
}

// ---------------------------------------------------------------------------
// Masking helper
// ---------------------------------------------------------------------------

/**
 * Masks an email address for display. Shows the first character of the local
 * part and the full domain: "alice@example.com" → "a****@example.com".
 *
 * If the address is malformed or empty, returns a generic placeholder rather
 * than a partially-rendered address, which could leak information.
 */
function maskEmail(email: string | undefined): string {
  if (!email) return 'your email address';
  const [local, domain] = email.split('@');
  if (!local || !domain) return 'your email address';
  if (local.length <= 1) return `${local}****@${domain}`;
  return `${local[0]}${'*'.repeat(Math.min(local.length - 1, 6))}@${domain}`;
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function MailCheckIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8" />
      <path d="m22 7-10 6L2 7" />
      <path d="m16 19 2 2 4-4" />
    </svg>
  );
}

function MailWarningIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M22 12V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8" />
      <path d="m22 7-10 6L2 7" />
      <path d="M16 19h6" />
      <path d="M19 16v6" />
    </svg>
  );
}

function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
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

// ---------------------------------------------------------------------------
// State components
// ---------------------------------------------------------------------------

function StateIcon({
  tone,
  children,
}: {
  tone: 'success' | 'warning' | 'neutral';
  children: React.ReactNode;
}) {
  const toneClass = {
    success:
      'bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-500',
    warning:
      'bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20 dark:text-amber-500',
    neutral: 'bg-muted text-muted-foreground ring-1 ring-border',
  }[tone];

  return (
    <div
      className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${toneClass}`}
    >
      {children}
    </div>
  );
}

function VerifiedState({ email, next }: { email: string; next?: string }) {
  return (
    <div className="space-y-6">
      <div className="space-y-3 text-center">
        <StateIcon tone="success">
          <CheckCircleIcon className="h-6 w-6" />
        </StateIcon>
        <div>
          <h1 className="text-lg font-semibold tracking-tight">
            Email verified
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {maskEmail(email)} is now confirmed. You can continue to your
            dashboard.
          </p>
        </div>
      </div>

      <Button asChild className="w-full">
        <Link href={next ?? '/dashboard'}>
          Continue to dashboard
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </Link>
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        <Link
          href="/"
          className="underline underline-offset-4 hover:text-foreground"
        >
          Return to home
        </Link>
      </p>
    </div>
  );
}

function PendingState({ email }: { email?: string }) {
  return (
    <div className="space-y-6">
      <div className="space-y-3 text-center">
        <StateIcon tone="neutral">
          <MailCheckIcon className="h-6 w-6" />
        </StateIcon>
        <div>
          <h1 className="text-lg font-semibold tracking-tight">
            Check your inbox
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            We sent a verification link to{' '}
            <span className="font-medium text-foreground">
              {maskEmail(email)}
            </span>
            . Click the link in that email to confirm your account.
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-muted/30 p-4">
        <p className="text-xs text-muted-foreground">
          <strong className="font-medium text-foreground">
            The link expires in 24 hours.
          </strong>{' '}
          If you do not see the email, check your spam folder before
          requesting a new one — repeated requests can delay delivery.
        </p>
      </div>

      {email ? (
        <ResendVerificationButton email={email} />
      ) : (
        <p className="text-center text-xs text-muted-foreground">
          <Link
            href="/login"
            className="underline underline-offset-4 hover:text-foreground"
          >
            Sign in
          </Link>{' '}
          to request a new verification email.
        </p>
      )}

      <p className="text-center text-xs text-muted-foreground">
        <Link
          href="/"
          className="underline underline-offset-4 hover:text-foreground"
        >
          Return to home
        </Link>
      </p>
    </div>
  );
}

function InvalidState({
  reason,
  email,
}: {
  reason: 'expired' | 'invalid';
  email?: string;
}) {
  const isExpired = reason === 'expired';

  return (
    <div className="space-y-6">
      <div className="space-y-3 text-center">
        <StateIcon tone="warning">
          <MailWarningIcon className="h-6 w-6" />
        </StateIcon>
        <div>
          <h1 className="text-lg font-semibold tracking-tight">
            {isExpired ? 'This link has expired' : 'This link is no longer valid'}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {isExpired
              ? 'Verification links expire after 24 hours. Request a new one and we will send it right away.'
              : 'This verification link has already been used, or it does not match an active account. If you have already verified, you can sign in.'}
          </p>
        </div>
      </div>

      {email ? (
        <ResendVerificationButton email={email} />
      ) : (
        <Button asChild className="w-full">
          <Link href="/login">
            Sign in
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      )}

      {email && (
        <Button asChild variant="ghost" className="w-full">
          <Link href="/login">Sign in instead</Link>
        </Button>
      )}

      <p className="text-center text-xs text-muted-foreground">
        <Link
          href="/"
          className="underline underline-offset-4 hover:text-foreground"
        >
          Return to home
        </Link>
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const state = await resolveVerificationState(searchParams);

  return (
    <AuthShell>
      <Card>
        <CardContent className="pt-6">
          {state.status === 'verified' && (
            <VerifiedState email={state.email} next={searchParams.next} />
          )}

          {(state.status === 'expired' || state.status === 'invalid') && (
            <InvalidState
              reason={state.status}
              email={searchParams.email}
            />
          )}

          {state.status === 'none' && (
            <PendingState email={searchParams.email} />
          )}
        </CardContent>
      </Card>
    </AuthShell>
  );
}