import * as React from 'react';
import Link from 'next/link';

export function CTA() {
  return (
    <section className="bg-sky-50">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-4 py-12 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-semibold">Ready to run your FIZ / FCZ on one platform?</h2>
          <p className="mt-1 text-sm text-slate-500">See the platform in 30 minutes. Bring your zone topology and we will map it live.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/api-docs" className="rounded-md border px-5 py-2.5 text-sm font-medium hover:bg-slate-50">Read API docs</Link>
          <Link href="/demo" className="rounded-md bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800">Book a demo</Link>
        </div>
      </div>
    </section>
  );
}
export default CTA;
