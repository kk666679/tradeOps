'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_SECTIONS, type NavItem, type NavSection } from './nav-config';

/* --------------------------------------------------------------------------
 * Icons — one inline set, no external dependency
 * ----------------------------------------------------------------------- */

type IconProps = React.SVGProps<SVGSVGElement>;
function S({ children, ...p }: IconProps & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
      {children}
    </svg>
  );
}

const ICONS: Record<string, (p: IconProps) => React.ReactElement> = {
  file:      (p) => <S {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></S>,
  warehouse: (p) => <S {...p}><path d="M2 20V9l10-5 10 5v11"/><path d="M6 20v-8h12v8"/></S>,
  cart:      (p) => <S {...p}><circle cx="9" cy="20" r="2"/><circle cx="18" cy="20" r="2"/><path d="M3 3h2l2 12h12l2-8H6"/></S>,
  globe:     (p) => <S {...p}><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z"/></S>,
  factory:   (p) => <S {...p}><path d="M3 21h18V10l-6 4V10l-6 4V10l-6 4z"/></S>,
  container: (p) => <S {...p}><rect x="3" y="6" width="18" height="12" rx="1"/><path d="M7 6v12M12 6v12M17 6v12"/></S>,
  cpu:       (p) => <S {...p}><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3"/></S>,
  plug:      (p) => <S {...p}><path d="M12 22v-5M9 8V2M15 8V2M18 8v3a6 6 0 0 1-12 0V8z"/></S>,
  truck:     (p) => <S {...p}><rect x="1" y="6" width="15" height="12" rx="1"/><path d="M16 10h4l3 4v4h-7z"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></S>,
  building:  (p) => <S {...p}><path d="M3 21h18V7l-9-4-9 4v14z"/><path d="M9 21V11h6v10"/></S>,
  users:     (p) => <S {...p}><circle cx="9" cy="8" r="3"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M16 4a3 3 0 0 1 0 6M22 21v-2a4 4 0 0 0-3-3.87"/></S>,
  shield:    (p) => <S {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></S>,
  card:      (p) => <S {...p}><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M2 10h20"/></S>,
  clock:     (p) => <S {...p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></S>,
  book:      (p) => <S {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></S>,
  chevron:   (p) => <S {...p}><path d="m6 9 6 6 6-6"/></S>,
};

function NavIcon({ name, className }: { name?: string; className?: string }) {
  const C = name ? ICONS[name] : null;
  if (!C) return null;
  return <C className={className ?? 'h-4 w-4'} />;
}

/* --------------------------------------------------------------------------
 * Active-route helper: longest-prefix match wins
 * ----------------------------------------------------------------------- */

function findActivePath(pathname: string, items: NavItem[]): string | null {
  let best: string | null = null;
  let bestLen = -1;

  function visit(item: NavItem) {
    if (item.href) {
      const hit =
        pathname === item.href ||
        pathname.startsWith(item.href + '/');
      if (hit && item.href.length > bestLen) {
        bestLen = item.href.length;
        best = item.href;
      }
    }
    item.children?.forEach(visit);
  }

  items.forEach(visit);
  return best;
}

function ancestorsOf(pathname: string, items: NavItem[], trail: string[] = []): string[] {
  for (const item of items) {
    const next = item.href ? [...trail, item.href] : trail;
    if (item.href && (pathname === item.href || pathname.startsWith(item.href + '/'))) {
      return next;
    }
    if (item.children) {
      const deeper = ancestorsOf(pathname, item.children, next);
      if (deeper.length) return deeper;
    }
  }
  return [];
}

/* --------------------------------------------------------------------------
 * Persistence for expanded state
 * ----------------------------------------------------------------------- */

const STORAGE_KEY = 'tradeops.nav.expanded';

function useExpandedState() {
  const [expanded, setExpanded] = React.useState<Set<string>>(() => new Set());
  const hydrated = React.useRef(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const arr = JSON.parse(raw) as string[];
        setExpanded(new Set(arr));
      }
    } catch {}
    hydrated.current = true;
  }, []);

  React.useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...expanded]));
    } catch {}
  }, [expanded]);

  const toggle = React.useCallback((key: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const open = React.useCallback((keys: string[]) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      keys.forEach((k) => next.add(k));
      return next;
    });
  }, []);

  return { expanded, toggle, open };
}

/* --------------------------------------------------------------------------
 * Individual nav item
 * ----------------------------------------------------------------------- */

function Item({
  item,
  depth,
  pathname,
  expanded,
  toggle,
}: {
  item: NavItem;
  depth: number;
  pathname: string;
  expanded: Set<string>;
  toggle: (key: string) => void;
}) {
  const key = item.href ?? item.label;
  const hasChildren = !!item.children?.length;
  const isOpen = expanded.has(key);
  const isActive =
    item.href === pathname ||
    (item.href != null && pathname.startsWith(item.href + '/'));
  // When a parent's children are present but the parent itself isn't the active route,
  // still highlight the item if any descendant matched
  const childActive = hasChildren
    ? item.children!.some((c) =>
        c.href &&
        (pathname === c.href || pathname.startsWith(c.href + '/')),
      )
    : false;

  const paddingLeft = 12 + depth * 12;

  return (
    <li>
      <div
        className={[
          'group flex items-center gap-2 rounded-md text-sm transition-colors',
          isActive && !hasChildren
            ? 'bg-[var(--bg-subtle)] text-[var(--text)]'
            : childActive
              ? 'text-[var(--text)]'
              : 'text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text)]',
        ].join(' ')}
      >
        {item.href ? (
          <Link
            href={item.href}
            style={{ paddingLeft, paddingRight: 8 }}
            className="flex flex-1 items-center gap-2 py-1.5"
          >
            {depth === 0 && <NavIcon name={item.icon} className="h-4 w-4 shrink-0" />}
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
            style={{ paddingLeft, paddingRight: 8 }}
            className="flex flex-1 items-center gap-2 py-1.5 text-left"
          >
            {depth === 0 && <NavIcon name={item.icon} className="h-4 w-4 shrink-0" />}
            <span className="truncate">{item.label}</span>
          </button>
        )}

        {hasChildren && (
          <button
            type="button"
            aria-label={isOpen ? 'Collapse' : 'Expand'}
            aria-expanded={isOpen}
            onClick={() => toggle(key)}
            className="mr-1 rounded p-1 hover:bg-[var(--bg-subtle)]"
          >
            <NavIcon
              name="chevron"
              className={
                'h-3 w-3 transition-transform ' + (isOpen ? '' : '-rotate-90')
              }
            />
          </button>
        )}
      </div>

      {hasChildren && isOpen && (
        <ul className="mt-0.5 space-y-0.5">
          {item.children!.map((child) => (
            <Item
              key={child.href ?? child.label}
              item={child}
              depth={depth + 1}
              pathname={pathname}
              expanded={expanded}
              toggle={toggle}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

/* --------------------------------------------------------------------------
 * Section wrapper
 * ----------------------------------------------------------------------- */

function Section({
  section,
  pathname,
  expanded,
  toggle,
}: {
  section: NavSection;
  pathname: string;
  expanded: Set<string>;
  toggle: (key: string) => void;
}) {
  const sectionKey = `__section__:${section.label}`;
  const isOpen = expanded.has(sectionKey);

  return (
    <div className="px-2 py-1.5">
      <button
        type="button"
        onClick={() => toggle(sectionKey)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)] hover:bg-[var(--bg-subtle)]"
      >
        <span>{section.label}</span>
        <NavIcon
          name="chevron"
          className={
            'h-3 w-3 transition-transform ' + (isOpen ? '' : '-rotate-90')
          }
        />
      </button>
      {isOpen && (
        <ul className="mt-1 space-y-0.5">
          {section.items.map((item) => (
            <Item
              key={item.href ?? item.label}
              item={item}
              depth={0}
              pathname={pathname}
              expanded={expanded}
              toggle={toggle}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

/* --------------------------------------------------------------------------
 * Public component
 * ----------------------------------------------------------------------- */

export function Sidebar({ className = '' }: { className?: string }) {
  const pathname = usePathname();
  const { expanded, toggle, open } = useExpandedState();

  // Auto-expand ancestors of the current route on mount / route change
  React.useEffect(() => {
    if (!pathname) return;
    const flat: NavItem[] = NAV_SECTIONS.flatMap((s) => s.items);
    const ancestors = ancestorsOf(pathname, flat);
    if (ancestors.length === 0) return;

    // ensure the matching section is open
    const sectionLabel = NAV_SECTIONS.find((s) =>
      s.items.some(
        (i) =>
          i.href === pathname ||
          (i.href && pathname.startsWith(i.href + '/')) ||
          i.children?.some(
            (c) => c.href && (pathname === c.href || pathname.startsWith(c.href + '/')),
          ),
      ),
    )?.label;

    open([
      ...ancestors,
      ...(sectionLabel ? [`__section__:${sectionLabel}`] : []),
    ]);
  }, [pathname, open]);

  return (
    <nav
      aria-label="Primary"
      className={`flex h-full flex-col overflow-y-auto ${className}`}
    >
      <div className="flex-1 py-2">
        {NAV_SECTIONS.map((section) => (
          <Section
            key={section.label}
            section={section}
            pathname={pathname ?? ''}
            expanded={expanded}
            toggle={toggle}
          />
        ))}
      </div>
    </nav>
  );
}

export default Sidebar;