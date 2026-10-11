'use client';
import * as React from 'react';

export interface FAQCategory { id: string; label: string; items: { q: string; a: string }[] }

export function FAQCategoryTabs({ categories }: { categories: FAQCategory[] }) {
  const [active, setActive] = React.useState(categories[0]?.id ?? '');
  const cur = categories.find((c) => c.id === active);
  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button key={c.id} onClick={() => setActive(c.id)} className={'rounded border px-3 py-1 text-xs transition ' + (active === c.id ? 'bg-slate-900 text-white' : 'hover:bg-slate-50')}>{c.label}</button>
        ))}
      </div>
      <ul className="space-y-2">
        {cur?.items.map((it, i) => (
          <li key={i} className="rounded border bg-white p-4 text-sm">
            <div className="font-medium">{it.q}</div>
            <div className="mt-1 text-slate-500">{it.a}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default FAQCategoryTabs;
