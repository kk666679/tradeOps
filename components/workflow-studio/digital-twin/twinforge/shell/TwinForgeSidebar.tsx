'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTwinForgeStore } from '../store/useTwinForgeStore';

const GROUPS = [
  {
    title: 'Service',
    items: [
      { href: '/twinforge/services', label: 'Catalogue',    icon: '⚙' },
      { href: '/twinforge/portfolio', label: 'Portfolio',   icon: '▣' },
      { href: '/twinforge/tenants',   label: 'Onboarding',  icon: '⬢' },
    ],
  },
  {
    title: 'Studio',
    items: [
      { href: '/twinforge/labs',        label: 'Labs',        icon: '⚗' },
      { href: '/twinforge/marketplace', label: 'Marketplace', icon: '⧉' },
    ],
  },
  {
    title: 'Contracts',
    items: [
      { href: '/twinforge/sla',      label: 'SLA Attainment', icon: '⏱' },
      { href: '/twinforge/outcomes', label: 'Outcomes',       icon: '◇' },
    ],
  },
  {
    title: 'Business',
    items: [
      { href: '/twinforge/roadmap',    label: 'Roadmap',    icon: '→' },
      { href: '/twinforge/experience', label: 'Experience', icon: '◎' },
    ],
  },
] as const;

export function TwinForgeSidebar() {
  const open = useTwinForgeStore((s) => s.sidebarOpen);
  const pathname = usePathname();

  if (!open) return null;

  return (
    <aside className="w-[220px] flex-none overflow-y-auto border-r border-slate-800 bg-slate-950/80 p-3">
      {GROUPS.map((g) => (
        <div key={g.title} className="mb-4">
          <h4 className="mb-1.5 px-2 text-[9px] font-bold uppercase tracking-widest text-slate-600">
            {g.title}
          </h4>
          <ul className="space-y-0.5">
            {g.items.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2 rounded px-2 py-1.5 text-[11.5px] transition ${
                      active
                        ? 'bg-slate-800 text-violet-300'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                    }`}
                  >
                    <span className="w-3 text-center opacity-70">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </aside>
  );
}
