'use client';
import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Search, ArrowRight, Clock, Zap } from 'lucide-react';
import { COMMAND_PALETTE_ROUTES, type SearchItem } from '@/config/commandPaletteRoutes';

/**
 * Command Palette Component
 * Quick search and navigation with Cmd/Ctrl + K
 * 
 * Features:
 * - Global keyboard shortcut (Cmd/Ctrl + K)
 * - Fuzzy route search
 * - Recent routes tracking
 * - Keyboard navigation
 * - Mobile optimized
 */
export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [recent, setRecent] = React.useState<SearchItem[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // All available routes loaded from config
  const routes: SearchItem[] = COMMAND_PALETTE_ROUTES;

  // Load recent routes from localStorage
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem('recent-routes');
    if (saved) {
      try {
        setRecent(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load recent routes:', e);
      }
    }
  }, []);

  // Simple fuzzy search
  const fuzzySearch = (query: string, items: SearchItem[]): SearchItem[] => {
    if (!query) return recent.length > 0 ? recent : [];

    const lowerQuery = query.toLowerCase();
    return items
      .filter(item =>
        item.label.toLowerCase().includes(lowerQuery) ||
        item.description?.toLowerCase().includes(lowerQuery)
      )
      .sort((a, b) => {
        const aExact = a.label.toLowerCase().startsWith(lowerQuery);
        const bExact = b.label.toLowerCase().startsWith(lowerQuery);
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        return a.label.localeCompare(b.label);
      });
  };

  const filteredItems = fuzzySearch(search, routes);

  // Keyboard shortcut handler
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isFormInput = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;

      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        if (!isFormInput) {
          e.preventDefault();
          setOpen(true);
          setTimeout(() => inputRef.current?.focus(), 0);
        }
        return;
      }

      if (e.key === 'Escape' && open) {
        setOpen(false);
        return;
      }

      if (!open) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => filteredItems.length > 0 ? (prev + 1) % filteredItems.length : 0);
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => prev === 0 ? Math.max(0, filteredItems.length - 1) : prev - 1);
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        const item = filteredItems[selectedIndex];
        if (item) navigateTo(item);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, selectedIndex, filteredItems]);

  // Navigate and track in recent
  const navigateTo = (item: SearchItem) => {
    // Add to recent routes (only if localStorage is available)
    if (typeof window !== 'undefined') {
      const newRecent = [
        item,
        ...recent.filter(r => r.id !== item.id),
      ].slice(0, 5);
      setRecent(newRecent);
      localStorage.setItem('recent-routes', JSON.stringify(newRecent));
    }

    // Navigate
    router.push(item.href);
    setOpen(false);
    setSearch('');
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="hidden lg:flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent transition-colors"
        title="Search (Ctrl+K)"
      >
        <Search className="h-3.5 w-3.5" />
        <span>Search...</span>
        <kbd className="ml-auto rounded px-1.5 py-0.5 text-xs font-mono bg-muted text-muted-foreground">
          Ctrl K
        </kbd>
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={() => setOpen(false)}
      />

      {/* Command Palette Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4">
        <div className="w-full max-w-lg rounded-lg border bg-background shadow-lg animate-in fade-in slide-in-from-top-8">
          {/* Search Input */}
          <div className="border-b px-4 py-3 flex items-center gap-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search routes or commands..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedIndex(0);
              }}
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
            />
            <kbd className="rounded px-2 py-1 text-xs bg-muted text-muted-foreground">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {filteredItems.length > 0 ? (
              <div className="space-y-0">
                {filteredItems.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => navigateTo(item)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors',
                      index === selectedIndex
                        ? 'bg-accent text-accent-foreground'
                        : 'text-foreground hover:bg-accent/50'
                    )}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    {item.category === 'recent' ? (
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Zap className="h-4 w-4 text-muted-foreground" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{item.label}</div>
                      {item.description && (
                        <div className="text-xs text-muted-foreground truncate">
                          {item.description}
                        </div>
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                {search ? 'No routes found. Try a different search.' : 'Type to search routes...'}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t px-4 py-2 text-xs text-muted-foreground space-y-0.5">
            <div>
              <kbd className="rounded px-1 py-0.5 text-xs bg-muted">↑↓</kbd>
              {' '}to navigate •{' '}
              <kbd className="rounded px-1 py-0.5 text-xs bg-muted">Enter</kbd>
              {' '}to select
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CommandPalette;
