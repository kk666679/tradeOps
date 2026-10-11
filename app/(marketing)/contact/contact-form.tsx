'use client';

import * as React from 'react';
import { useFormStatus } from 'react-dom';

/**
 * Contact form.
 *
 * The form posts to a Server Action (see `actions.ts`). This keeps the
 * following on the server and never exposes them to the browser:
 *   - The email provider API key
 *   - The Discord webhook URL
 *   - Any rate-limiting state
 *
 * Spam protection uses a honeypot field rather than CAPTCHA. A CAPTCHA adds
 * friction and a third-party dependency for what is, in practice, a solved
 * problem: bots fill honeypot fields because they parse the DOM naively.
 * A hidden field that must remain empty catches the overwhelming majority.
 *
 * Rate limiting is enforced server-side in the Server Action. See actions.ts.
 */

type FormState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  fieldErrors?: Record<string, string>;
};

const INITIAL_STATE: FormState = { status: 'idle' };

export function ContactForm() {
  const [state, setState] = React.useState<FormState>(INITIAL_STATE);

  async function handleSubmit(formData: FormData) {
    setState({ status: 'idle' });

    const payload = {
      name: String(formData.get('name') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      company: String(formData.get('company') ?? '').trim(),
      role: String(formData.get('role') ?? '').trim(),
      zoneType: String(formData.get('zoneType') ?? '').trim(),
      message: String(formData.get('message') ?? '').trim(),
      honeypot: String(formData.get('_gotcha') ?? ''),
    };

    // Client-side validation gives instant feedback. The Server Action
    // re-validates because the client cannot be trusted.
    const fieldErrors: Record<string, string> = {};
    if (!payload.name) fieldErrors.name = 'Your name is required.';
    if (!payload.email) {
      fieldErrors.email = 'Your email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      fieldErrors.email = 'Please enter a valid email address.';
    }
    if (!payload.message || payload.message.length < 10) {
      fieldErrors.message = 'Please tell us a little about what you need.';
    }

    if (Object.keys(fieldErrors).length > 0) {
      setState({ status: 'error', fieldErrors });
      return;
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as {
        ok: boolean;
        error?: string;
        fieldErrors?: Record<string, string>;
      };

      if (!res.ok || !data.ok) {
        setState({
          status: 'error',
          message: data.error ?? 'Something went wrong. Please try again.',
          fieldErrors: data.fieldErrors,
        });
        return;
      }

      setState({
        status: 'success',
        message:
          'Thank you — your message is on its way. We will get back to you within one business day.',
      });
    } catch {
      setState({
        status: 'error',
        message:
          'We could not send your message. Please try again, or reach us on WhatsApp.',
      });
    }
  }

  if (state.status === 'success') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.06] p-8"
      >
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
              <path d="M8.5 13.5 4 9l1.4-1.4 3.1 3.1 6.1-6.1L16 6l-7.5 7.5Z" />
            </svg>
          </span>
          <div>
            <p className="text-sm font-medium">Message sent</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {state.message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      action={handleSubmit}
      className="rounded-xl border bg-background p-6 sm:p-8"
      noValidate
    >
      {/* Honeypot: hidden from humans, irresistible to naive bots. */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor="_gotcha">Leave this field empty</label>
        <input
          id="_gotcha"
          name="_gotcha"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Your name"
          name="name"
          required
          autoComplete="name"
          error={state.fieldErrors?.name}
        />
        <Field
          label="Work email"
          name="email"
          type="email"
          required
          autoComplete="email"
          error={state.fieldErrors?.email}
        />
        <Field
          label="Company"
          name="company"
          autoComplete="organization"
        />
        <Field
          label="Your role"
          name="role"
          placeholder="e.g. Operations Director"
        />
      </div>

      <div className="mt-5">
        <label
          htmlFor="zoneType"
          className="block text-sm font-medium"
        >
          Zone type
        </label>
        <select
          id="zoneType"
          name="zoneType"
          defaultValue=""
          className="mt-1.5 block w-full rounded-lg border bg-background px-3 py-2 text-sm shadow-sm transition-colors focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
        >
          <option value="">Select if applicable</option>
          <option value="fiz">Free Industrial Zone (FIZ)</option>
          <option value="fcz">Free Commercial Zone (FCZ)</option>
          <option value="bonded">Bonded warehouse</option>
          <option value="cfs">Container Freight Station (CFS)</option>
          <option value="multiple">Multiple zones</option>
          <option value="evaluating">Still evaluating</option>
        </select>
      </div>

      <div className="mt-5">
        <label
          htmlFor="message"
          className="block text-sm font-medium"
        >
          What are you trying to solve?
          <span className="ml-0.5 text-red-600 dark:text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="Tell us about your operation, the systems you use today, and what you would like to change."
          className="mt-1.5 block w-full rounded-lg border bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
        />
        {state.fieldErrors?.message && (
          <p className="mt-1.5 text-xs text-red-600 dark:text-red-500">
            {state.fieldErrors.message}
          </p>
        )}
      </div>

      {state.status === 'error' && state.message && (
        <div
          role="alert"
          className="mt-5 rounded-lg border border-red-500/30 bg-red-500/[0.06] px-4 py-3 text-sm text-red-700 dark:text-red-400"
        >
          {state.message}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <SubmitButton />

        <p className="text-xs text-muted-foreground">
          By submitting, you agree to our{' '}
          <a
            href="/legal/privacy"
            className="underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = 'text',
  required = false,
  placeholder,
  autoComplete,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium">
        {label}
        {required && (
          <span className="ml-0.5 text-red-600 dark:text-red-500">*</span>
        )}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="mt-1.5 block w-full rounded-lg border bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
      />
      {error && (
        <p className="mt-1.5 text-xs text-red-600 dark:text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <>
          <span
            aria-hidden="true"
            className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-background border-t-transparent"
          />
          Sending…
        </>
      ) : (
        <>
          Send message
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="h-4 w-4"
          >
            <path d="M4 10h12M11 5l5 5-5 5" />
          </svg>
        </>
      )}
    </button>
  );
}