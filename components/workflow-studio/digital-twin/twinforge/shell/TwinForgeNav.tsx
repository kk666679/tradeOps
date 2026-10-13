'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ITEMS = [
  { href: '/twinforge',              label: 'Overview',    icon: '◆' },
  { href: '/twinforge/services',     label: 'Services',    icon: '⚙' },
  { href: '/twinforge/portfolio',    label: 'Portfolio',   icon: '▣' },
  { href: '/twinforge/labs',         label: 'Labs',        icon: '⚗' },
  { href: '/twinforge/marketplace',  label: 'Marketplace', icon: '⧉' },
  { href: '/twinforge/tenants',      label: 'Tenants',     icon: '⬢' },
  { href: '/twinforge/sla',          label: 'SLA',         icon: '⏱' },
  { href: '/twinforge/outcomes',     label: 'Outcomes',    icon: '◇' },
  { href: '/twinforge/roadmap',      label: 'Roadmap',     icon: '→' },
  { href: '/twinforge/experience',   label: 'Experience',  icon: '◎' },
] as const;

export function TwinForgeNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex h-10 flex-none items-center gap-1 border-b border-slate-800 bg-slate-900/60 px-3 overflow-x-auto"
      aria-label="TwinForge sections"
    >
      <Link
        href="/dashboard"
        className="mr-2 text-[10px] font-medium uppercase tracking-wide text-slate-500 transition hover:text-slate-300 whitespace-nowrap"
      >
        ← Dashboard
      </Link>

      <span className="mr-3 text-slate-700">|</span>

      <span className="mr-3 text-[10px] font-bold uppercase tracking-widest text-violet-400 whitespace-nowrap">
        TwinForge
      </span>

      {ITEMS.map((item) => {
        const active =
          item.href === '/twinforge'
            ? pathname === '/twinforge'
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`whitespace-nowrap rounded px-2.5 py-1 text-[11px] font-semibold transition ${
              active
                ? 'bg-slate-800 text-violet-300'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <span className="mr-1 opacity-70">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
