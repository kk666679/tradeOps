import * as React from 'react';
import Link from 'next/link';

export interface UseCaseCardProps { title: string; body: string; href?: string; tone?: 'sky' | 'amber' | 'violet' }

export function UseCaseCard({ title, body, href, tone = 'sky' }: UseCaseCardProps) {
  const ring = tone === 'amber' ? 'border-amber-200' : tone === 'violet' ? 'border-violet-200' : 'border-sky-200';
  return (
    <div className={'rounded-lg border bg-white p-5 transition hover:shadow-sm ' + ring}>
      <div className="text-base font-medium">{title}</div>
      <p className="mt-1 text-sm text-slate-500">{body}</p>
      {href ? <Link className="mt-3 inline-block text-sm text-sky-700 hover:underline" href={href}>Learn more →</Link> : null}
    </div>
  );
}
export default UseCaseCard;
