import * as React from 'react';
import Link from 'next/link';

export interface CTASplitProps {
  title: string;
  body: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}

export function CTASplit({ title, body, primary, secondary }: CTASplitProps) {
  return (
    <section className="border-b">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-14 md:grid-cols-2">
        <div className="rounded-lg border bg-slate-50 p-8">
          <div className="text-lg font-semibold">{title}</div>
          <p className="mt-2 text-sm text-slate-500">{body}</p>
        </div>
        <div className="flex flex-col justify-center gap-3">
          {primary ? <Link href={primary.href} className="rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-slate-800">{primary.label}</Link> : null}
          {secondary ? <Link href={secondary.href} className="rounded-md border px-5 py-2.5 text-center text-sm font-medium hover:bg-slate-50">{secondary.label}</Link> : null}
        </div>
      </div>
    </section>
  );
}
export default CTASplit;
