'use client';
import * as React from 'react';
import Link from 'next/link';

export interface UseCase { id: string; label: string; body: string; href?: string }

export function UseCaseTabs({ cases }: { cases: UseCase[] }) {
  const [active, setActive] = React.useState(cases[0]?.id ?? '');
  const cur = cases.find((c) => c.id === active);
  return (
    <div className="grid gap-6 md:grid-cols-[240px_1fr]">
      <ul className="space-y-1">
        {cases.map((c) => (
          <li key={c.id}>
            <button onClick={() => setActive(c.id)} className={'w-full rounded px-3 py-2 text-left text-sm transition ' + (active === c.id ? 'bg-slate-100 font-medium' : 'hover:bg-slate-50')}>{c.label}</button>
          </li>
        ))}
      </ul>
      <div className="rounded-lg border bg-white p-6">
        {cur ? (
          <>
            <div className="text-base font-medium">{cur.label}</div>
            <p className="mt-2 text-sm text-slate-500">{cur.body}</p>
            {cur.href ? <Link href={cur.href} className="mt-4 inline-block text-sm text-sky-700 hover:underline">Learn more →</Link> : null}
          </>
        ) : null}
      </div>
    </div>
  );
}
export default UseCaseTabs;
