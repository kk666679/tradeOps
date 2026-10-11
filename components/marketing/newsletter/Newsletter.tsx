import * as React from 'react';
import { NewsletterForm } from './NewsletterForm';

export function Newsletter() {
  return (
    <section className="border-b bg-slate-50/60">
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h2 className="text-2xl font-semibold">Get product updates for FIZ / FCZ operators</h2>
        <p className="mt-2 text-sm text-slate-500">One email a month. Compliance changes, new agents, integration releases.</p>
        <div className="mt-6"><NewsletterForm /></div>
      </div>
    </section>
  );
}
export default Newsletter;
