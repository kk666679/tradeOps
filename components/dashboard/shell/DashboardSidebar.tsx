'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_SECTIONS, type NavItem, type NavSection } from './nav-config';

type IconProps = React.SVGProps<SVGSVGElement>;
function I({ children, ...p }: IconProps & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
      {children}
    </svg>
  );
}

const ICONS: Record<string, (p: IconProps) => React.ReactElement> = {
  file:      (p) => <I {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></I>,
  warehouse: (p) => <I {...p}><path d="M2 20V9l10-5 10 5v11"/><path d="M6 20v-8h12v8"/></I>,
  cart:      (p) => <I {...p}><circle cx="9" cy="20" r="2"/><circle cx="18" cy="20" r="2"/><path d="M3 3h2l2 12h12l2-8H6"/></I>,
  globe:     (p) => <I {...p}><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z"/></I>,
  factory:   (p) => <I {...p}><path d="M3 21h18V10l-6 4V10l-6 4V10l-6 4z"/></I>,
  container: (p) => <I {...p}><rect x="3" y="6" width="18" height="12" rx="1"/><path d="M7 6v12M12 6v12M17 6v12"/></I>,
  cpu:       (p) => <I {...p}><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/></I>,
  plug:      (p) => <I {...p}><path d="M12 22v-5M9 8V2M15 8V2M18 8v3a6 6 0 0 1-12 0V8z"/></I>,
  building:  (p) => <I {...p}><path d="M3 21h18V7l-9-4-9 4v14z"/><path d="M9 21V11h6v10"/></I>,
  users:     (p) => <I {...p}><circle cx="9" cy="8" r="3"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/></I>,
  shield:    (p) => <I {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></I>,
  card:      (p) => <I {...p}><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M2 10h20"/></I>,
  clock:     (p) => <I {...p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></I>,
  book:      (p) => <I {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></I>,
  chevron:   (p) => <I {...p}><path d="m6 9 6 6 6-6"/></I>,
};

function Icon({ name, className = 'h-4 w-4' }: { name?: string; className?: string }) {
  const C = name ? ICONS[name] : null;
  return C ? <C className={className} /> : null;
}

const STORAGE_KEY = 'tradeops.nav.open';

function useOpen() {
  const [open, setOpen] = React.useState<Set<string>>(new Set());
  const ready = React.useRef(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setOpen(new Set(JSON.parse(raw) as string[]));
    } catch {}
    ready.current = true;
  }, []);

  React.useEffect(() => {
    if (!ready.current) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...open])); } catch {}
  }, [open]);

  const toggle = React.useCallback((k: string) => {
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(k) ? next.delete(k) : next.add(k);
      return next;
    });
  }, []);

  const add = React.useCallback((keys: string[]) => {
    setOpen((prev) => {
      const next = new Set(prev);
      keys.forEach((k) => next.add(k));
      return next;
    });
  }, []);

  return { open, toggle, add };
}

function ancestors(pathname: string, items: NavItem[], trail: string[] = []): string[] {
  for (const item of items) {
    const next = item.href ? [...trail, item.href] : trail;
    if (item.href && (pathname === item.href || pathname.startsWith(item.href + '/'))) {
      return next;
    }
    if (item.children) {
      const deeper = ancestors(pathname, item.children, next);
      if (deeper.length) return deeper;
    }
  }
  return [];
}

function Row({
  item, depth, pathname, open, toggle,
}: {
  item: NavItem; depth: number; pathname: string;
  open: Set<string>; toggle: (k: string) => void;
}) {
  const key = item.href ?? item.label;
  const hasKids = !!item.children?.length;
  const isOpen = open.has(key);
  const isActive =
    item.href != null && (pathname === item.href || pathname.startsWith(item.href + '/'));
  const childActive = hasKids
    ? item.children!.some((c) =>
        c.href != null && (pathname === c.href || pathname.startsWith(c.href + '/')),
      )
    : false;

  return (
    <li>
      <div
        className={[
          'group flex items-center gap-1 rounded-md text-sm transition-colors',
          isActive && !hasKids
            ? 'bg-[var(--bg-subtle)] text-[var(--text)]'
            : childActive
              ? 'text-[var(--text)]'
              : 'text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text)]',
        ].join(' ')}
      >
        {item.href ? (
          <Link
            href={item.href}
            className="flex flex-1 items-center gap-2 py-1.5 pl-2 pr-1"
            style={{ paddingLeft: 8 + depth * 12 }}
          >
            {depth === 0 && <Icon name={item.icon} />}
            {depth > 0 && (
              <span
                aria-hidden
                className="h-1 w-1 shrink-0 rounded-full bg-current opacity-40"
              />
            )}
            <span className="truncate">{item.label}</span>
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => toggle(key)}
            className="flex flex-1 items-center gap-2 py-1.5 pr-1 text-left"
            style={{ paddingLeft: 8 + depth * 12 }}
          >
            {depth === 0 && <Icon name={item.icon} />}
            <span className="truncate">{item.label}</span>
          </button>
        )}
        {hasKids && (
          <button
            type="button"
            aria-label={isOpen ? 'Collapse' : 'Expand'}
            aria-expanded={isOpen}
            onClick={() => toggle(key)}
            className="mr-1 rounded p-1 hover:bg-[var(--bg-subtle)]"
          >
            <Icon
              name="chevron"
              className={'h-3 w-3 transition-transform ' + (isOpen ? '' : '-rotate-90')}
            />
          </button>
        )}
      </div>
      {hasKids && isOpen && (
        <ul className="mt-0.5 space-y-0.5">
          {item.children!.map((c) => (
            <Row
              key={c.href ?? c.label}
              item={c}
              depth={depth + 1}
              pathname={pathname}
              open={open}
              toggle={toggle}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function Group({
  section, pathname, open, toggle,
}: {
  section: NavSection; pathname: string;
  open: Set<string>; toggle: (k: string) => void;
}) {
  const key = `__section__:${section.label}`;
  const isOpen = open.has(key);
  return (
    <div className="px-2 py-1.5">
      <button
        type="button"
        onClick={() => toggle(key)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)] hover:bg-[var(--bg-subtle)]"
      >
        <span>{section.label}</span>
        <Icon
          name="chevron"
          className={'h-3 w-3 transition-transform ' + (isOpen ? '' : '-rotate-90')}
        />
      </button>
      {isOpen && (
        <ul className="mt-1 space-y-0.5">
          {section.items.map((item) => (
            <Row
              key={item.href ?? item.label}
              item={item}
              depth={0}
              pathname={pathname}
              open={open}
              toggle={toggle}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export function DashboardSidebar() {
  const pathname = usePathname() ?? '';
  const { open, toggle, add } = useOpen();

  React.useEffect(() => {
    if (!pathname) return;
    const flat = NAV_SECTIONS.flatMap((s) => s.items);
    const trail = ancestors(pathname, flat);
    const section = NAV_SECTIONS.find((s) =>
      s.items.some(
        (i) =>
          (i.href && (pathname === i.href || pathname.startsWith(i.href + '/'))) ||
          i.children?.some(
            (c) => c.href && (pathname === c.href || pathname.startsWith(c.href + '/')),
          ),
      ),
    );
    add([
      ...trail,
      ...(section ? [`__section__:${section.label}`] : []),
    ]);
  }, [pathname, add]);

  return (
    <nav aria-label="Primary" className="flex h-full flex-col overflow-y-auto">
      <div className="flex-1 py-2">
        {NAV_SECTIONS.map((section) => (
          <Group
            key={section.label}
            section={section}
            pathname={pathname}
            open={open}
            toggle={toggle}
          />
        ))}
      </div>
    </nav>
  );
}

export default DashboardSidebar;