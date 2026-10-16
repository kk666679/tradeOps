'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from 'react';
import { ALL_LEVELS } from './constants';
import { capBuffer, levelOf, matchEntry } from './utils';
import type { ConsoleCounts, ConsoleEntry, ConsoleLevel } from './types';

export function useConsoleBuffer(
  entries: ConsoleEntry[],
  maxRows: number,
): ConsoleEntry[] {
  return useMemo(() => capBuffer(entries, maxRows), [entries, maxRows]);
}

export interface ConsoleFilterApi {
  activeLevels: Set<ConsoleLevel>;
  toggleLevel: (lv: ConsoleLevel) => void;
  setOnlyLevel: (lv: ConsoleLevel) => void;
  resetLevels: () => void;
  query: string;
  setQuery: (q: string) => void;
  clearQuery: () => void;
  filtered: ConsoleEntry[];
  counts: ConsoleCounts;
  hasFilters: boolean;
  clearFilters: () => void;
}

export function useConsoleFilter(entries: ConsoleEntry[]): ConsoleFilterApi {
  const [activeLevels, setActiveLevels] = useState<Set<ConsoleLevel>>(
    () => new Set(ALL_LEVELS),
  );
  const [query, setQuery] = useState('');

  const toggleLevel = useCallback((lv: ConsoleLevel) => {
    setActiveLevels((prev) => {
      const next = new Set(prev);
      if (next.has(lv)) next.delete(lv);
      else next.add(lv);
      return next.size ? next : new Set(ALL_LEVELS);
    });
  }, []);

  const setOnlyLevel = useCallback((lv: ConsoleLevel) => {
    setActiveLevels(new Set([lv]));
  }, []);

  const resetLevels = useCallback(() => {
    setActiveLevels(new Set(ALL_LEVELS));
  }, []);

  const clearQuery = useCallback(() => setQuery(''), []);

  const counts = useMemo<ConsoleCounts>(() => {
    const c: ConsoleCounts = {
      INFO: 0,
      DEBUG: 0,
      WARN: 0,
      ERR: 0,
      LOOP: 0,
      total: entries.length,
    };
    for (const e of entries) c[levelOf(e)]++;
    return c;
  }, [entries]);

  const filtered = useMemo(() => {
    const q = query.trim();
    return entries.filter(
      (e) => activeLevels.has(levelOf(e)) && matchEntry(e, q),
    );
  }, [entries, activeLevels, query]);

  const hasFilters =
    query.trim().length > 0 || activeLevels.size !== ALL_LEVELS.length;

  const clearFilters = useCallback(() => {
    setActiveLevels(new Set(ALL_LEVELS));
    setQuery('');
  }, []);

  return {
    activeLevels,
    toggleLevel,
    setOnlyLevel,
    resetLevels,
    query,
    setQuery,
    clearQuery,
    filtered,
    counts,
    hasFilters,
    clearFilters,
  };
}

export interface AutoScrollApi {
  ref: RefObject<HTMLDivElement | null>;
  autoScroll: boolean;
  setAutoScroll: (v: boolean) => void;
  toggle: () => void;
}

export function useAutoScroll(trigger: number): AutoScrollApi {
  const ref = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (!autoScroll) return;
    const el = ref.current;
    if (!el) return;
    el.scrollTop = 0;
  }, [trigger, autoScroll]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      if (el.scrollTop > 4 && autoScroll) setAutoScroll(false);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [autoScroll]);

  const toggle = useCallback(() => setAutoScroll((v) => !v), []);

  return { ref, autoScroll, setAutoScroll, toggle };
}
