'use client';
import * as React from 'react';

export interface NewsletterFormProps {
  onSubmit?: (email: string) => void | Promise<void>;
  submitting?: boolean;
}

export function NewsletterForm({ onSubmit, submitting }: NewsletterFormProps) {
  const [email, setEmail] = React.useState('');
  const [done, setDone] = React.useState(false);
  return (
    <form className="mx-auto flex max-w-md gap-2" onSubmit={async (e) => { e.preventDefault(); await onSubmit?.(email); setDone(true); }}>
      <input type="email" placeholder="you@company.com" className="flex-1 rounded-md border px-3 py-2 text-sm" value={email} onChange={(e) => setEmail(e.target.value)} required aria-label="Work email" />
      <button type="submit" disabled={submitting || done} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50">{done ? 'Subscribed' : 'Subscribe'}</button>
    </form>
  );
}
export default NewsletterForm;
