'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, Clock, Compass } from 'lucide-react';
import { COMMAND_PALETTE_ROUTES, type SearchItem } from '@/config/commandPaletteRoutes';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

function isRecentItem(value: unknown): value is SearchItem {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return typeof item.id === 'string'
    && typeof item.label === 'string'
    && (item.description === undefined || typeof item.description === 'string')
    && typeof item.href === 'string'
    && item.href.startsWith('/')
    && !item.href.startsWith('//')
    && (item.category === 'route' || item.category === 'recent' || item.category === 'action');
}

/** Route navigation palette. Operational record search is not currently provided by the backend. */
export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [recent, setRecent] = React.useState<SearchItem[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const results = React.useMemo(() => {
    if (!search.trim()) return recent;
    const query = search.toLowerCase();
    return COMMAND_PALETTE_ROUTES
      .filter((item) => item.label.toLowerCase().includes(query) || item.description?.toLowerCase().includes(query))
      .sort((a, b) => Number(b.label.toLowerCase().startsWith(query)) - Number(a.label.toLowerCase().startsWith(query)) || a.label.localeCompare(b.label));
  }, [recent, search]);

  React.useEffect(() => {
    try {
      const saved = window.localStorage.getItem('recent-routes');
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) setRecent(parsed.filter(isRecentItem).slice(0, 5));
      }
    } catch {
      // Recent navigation is an optional convenience; ignore unavailable or invalid storage.
    }
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      const typing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || (target instanceof HTMLElement && target.isContentEditable);
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k' && !typing) {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  React.useEffect(() => {
    if (open) {
      setSearch('');
      setSelectedIndex(0);
      window.requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  React.useEffect(() => setSelectedIndex(0), [search]);

  const navigateTo = (item: SearchItem) => {
    const nextRecent = [item, ...recent.filter((entry) => entry.id !== item.id)].slice(0, 5);
    setRecent(nextRecent);
    try { window.localStorage.setItem('recent-routes', JSON.stringify(nextRecent)); } catch { /* optional cache */ }
    setOpen(false);
    router.push(item.href);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setSelectedIndex((current) => results.length ? (current + 1) % results.length : 0);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSelectedIndex((current) => results.length ? (current === 0 ? results.length - 1 : current - 1) : 0);
    } else if (event.key === 'Enter' && results[selectedIndex]) {
      event.preventDefault();
      navigateTo(results[selectedIndex]);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className="h-9 w-9 shrink-0 justify-start px-0 text-muted-foreground sm:w-60 sm:px-3 lg:w-80"
        onClick={() => setOpen(true)}
        aria-label="Search application pages"
      >
        <Search className="mx-auto size-4 shrink-0 sm:mx-0" aria-hidden="true" />
        <span className="hidden truncate text-sm font-normal sm:inline">Search pages and modules</span>
        <kbd className="ml-auto hidden rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground lg:inline">⌘ K</kbd>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="top-[12vh] max-h-[76vh] -translate-y-0 overflow-hidden p-0 sm:top-[16vh]">
          <DialogTitle className="sr-only">Search application pages</DialogTitle>
          <DialogDescription className="sr-only">Search pages and modules. Operational record search is unavailable here.</DialogDescription>
          <div className="flex items-center gap-3 border-b px-4">
            <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <input
              ref={inputRef}
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Search pages and modules…"
              aria-label="Search pages and modules"
              aria-controls="command-results"
              aria-autocomplete="list"
              aria-activedescendant={results[selectedIndex] ? `command-result-${results[selectedIndex].id}` : undefined}
              className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="hidden rounded border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline">ESC</kbd>
          </div>
          <div id="command-results" role="listbox" aria-label="Page search results" className="max-h-[55vh] overflow-y-auto p-1.5">
            {results.length ? results.map((item, index) => (
              <button
                key={item.id}
                id={`command-result-${item.id}`}
                type="button"
                role="option"
                aria-selected={index === selectedIndex}
                onClick={() => navigateTo(item)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={cn('flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', index === selectedIndex ? 'bg-accent text-accent-foreground' : 'text-foreground hover:bg-accent/60')}
              >
                {item.category === 'recent' ? <Clock className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" /> : <Compass className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />}
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{item.label}</span>
                  {item.description && <span className="block truncate text-xs text-muted-foreground">{item.description}</span>}
                </span>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              </button>
            )) : (
              <p className="px-3 py-8 text-center text-sm text-muted-foreground">{search ? 'No pages found.' : 'Type to search pages and modules.'}</p>
            )}
          </div>
          <div className="border-t px-4 py-2 text-xs text-muted-foreground">Page navigation only · Use ↑ ↓ to move and Enter to open</div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CommandPalette;
