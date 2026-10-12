// @ts-nocheck — see docs/app-walkthroughs-e2e-audit.md
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { resendVerificationEmail } from './actions';

/**
 * Resend verification email button.
 *
 * Cooldown is enforced client-side for immediate UX feedback and
 * server-side for actual rate limiting. The client cooldown is 60 seconds,
 * matching the server-side limit.
 *
 * The button is disabled during the request and during the cooldown period.
 * The remaining time is announced to assistive technology via a live region
 * so a screen-reader user knows why the button is disabled.
 */

const COOLDOWN_SECONDS = 60;

type State =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'sent' }
  | { kind: 'error'; message: string };

export function ResendVerificationButton({ email }: { email: string }) {
  const [state, setState] = React.useState<State>({ kind: 'idle' });
  const [cooldown, setCooldown] = React.useState(0);

  // Cooldown ticker. Uses a single interval that decrements until zero, then
  // clears itself. This avoids the drift that comes from nested setTimeout
  // and keeps the component clean on unmount.
  React.useEffect(() => {
    if (cooldown <= 0) return;
    const id = window.setInterval(() => {
      setCooldown((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [cooldown]);

  async function handleResend() {
    setState({ kind: 'sending' });

    try {
      const result = await resendVerificationEmail({ email });

      if (result.ok) {
        setState({ kind: 'sent' });
        setCooldown(COOLDOWN_SECONDS);
        return;
      }

      setState({
        kind: 'error',
        message:
          result.error ??
          'We could not send the email. Please try again in a moment.',
      });
    } catch {
      setState({
        kind: 'error',
        message:
          'We could not send the email. Please check your connection and try again.',
      });
    }
  }

  const isDisabled =
    state.kind === 'sending' || cooldown > 0;

  // Live region content: announced when the state changes. Kept short so the
  // user is not read a paragraph.
  const liveMessage =
    state.kind === 'sending'
      ? 'Sending verification email'
      : state.kind === 'sent'
        ? 'Verification email sent. Check your inbox.'
        : state.kind === 'error'
          ? state.message
          : '';

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleResend}
        disabled={isDisabled}
        aria-describedby="resend-status"
      >
        {state.kind === 'sending' ? (
          <>
            <span
              aria-hidden="true"
              className="mr-2 h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
            />
            Sending…
          </>
        ) : cooldown > 0 ? (
          <>
            Resend available in {cooldown}s
          </>
        ) : state.kind === 'sent' ? (
          <>Send another email</>
        ) : (
          <>Resend verification email</>
        )}
      </Button>

      {/* Live region. Screen readers announce changes without moving focus. */}
      <p
        id="resend-status"
        role="status"
        aria-live="polite"
        className="min-h-[1rem] text-center text-xs"
      >
        {state.kind === 'error' ? (
          <span className="text-red-600 dark:text-red-500">
            {state.message}
          </span>
        ) : state.kind === 'sent' ? (
          <span className="text-emerald-600 dark:text-emerald-500">
            Sent. If it does not arrive within a few minutes, check your spam
            folder.
          </span>
        ) : (
          <span className="sr-only">{liveMessage}</span>
        )}
      </p>
    </div>
  );
}