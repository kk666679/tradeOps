'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from 'react';
import { HISTORY_LIMIT } from './constants';
import type { CommandSpec } from './types';

export interface HistoryApi {
  history: string[];
  push: (cmd: string) => void;
  index: number;
  up: () => string | undefined;
  down: () => string | undefined;
  reset: () => void;
}

export function useHistory(limit = HISTORY_LIMIT): HistoryApi {
  const [history, setHistory] = useState<string[]>([]);
  const [index, setIndex] = useState(-1);

  const push = useCallback(
    (cmd: string) => {
      setHistory((h) => {
        const last = h[h.length - 1];
        if (last === cmd) return h;
        const next = [...h, cmd];
        return next.length > limit ? next.slice(-limit) : next;
      });
      setIndex(-1);
    },
    [limit],
  );

  const up = useCallback((): string | undefined => {
    if (!history.length) return undefined;
    setIndex((i) => {
      const next = i === -1 ? history.length - 1 : Math.max(0, i - 1);
      return next;
    });
    const i = index === -1 ? history.length - 1 : Math.max(0, index - 1);
    return history[i];
  }, [history, index]);

  const down = useCallback((): string | undefined => {
    if (index === -1) return undefined;
    const next = index + 1;
    if (next >= history.length) {
      setIndex(-1);
      return '';
    }
    setIndex(next);
    return history[next];
  }, [history, index]);

  const reset = useCallback(() => setIndex(-1), []);

  return { history, push, index, up, down, reset };
}

export interface AutocompleteApi {
  ghost: string;
  suggestion: string | null;
  complete: (input: string) => {
    apply?: string;
    candidates?: string[];
  };
  clearGhost: () => void;
}

export function useAutocomplete(
  registry: readonly CommandSpec[],
  resolve: (name: string) => CommandSpec | undefined,
): AutocompleteApi {
  const [ghost, setGhost] = useState('');
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const clearGhost = useCallback(() => {
    setGhost('');
    setSuggestion(null);
  }, []);

  const compute = useCallback(
    (input: string): { apply?: string; candidates?: string[] } => {
      const raw = input;
      const parts = raw.split(/\s+/);
      const head = parts[0] ?? '';

      if (parts.length <= 1) {
        const matches = registry
          .filter((c) => !c.hidden && c.name.startsWith(head.toLowerCase()))
          .map((c) => c.name);

        if (matches.length === 1) {
          const apply = matches[0] + ' ';
          setGhost(apply.slice(raw.length));
          setSuggestion(apply);
          return { apply };
        }
        if (matches.length > 1) {
          setGhost('');
          setSuggestion(null);
          return { candidates: matches.sort() };
        }
        return {};
      }

      const spec = resolve(head);
      if (!spec?.completions) return {};
      const partial = parts[parts.length - 1] ?? '';
      const cands = spec.completions(parts.slice(1, -1)).filter((c) =>
        c.toLowerCase().startsWith(partial.toLowerCase()),
      );

      if (cands.length === 1) {
        const prefix = parts.slice(0, -1).join(' ');
        const apply = `${prefix} ${cands[0]}`;
        setGhost(apply.slice(raw.length));
        setSuggestion(apply);
        return { apply };
      }
      if (cands.length > 1) {
        setGhost('');
        setSuggestion(null);
        return { candidates: [...cands].sort() };
      }
      return {};
    },
    [registry, resolve],
  );

  return { ghost, suggestion, complete: compute, clearGhost };
}

export function useFocusOnClick<T extends HTMLElement>(): {
  wrapperRef: RefObject<T | null>;
  inputRef: RefObject<HTMLInputElement | null>;
  focus: () => void;
} {
  const wrapperRef = useRef<T>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const focus = useCallback(() => inputRef.current?.focus(), []);

  useEffect(() => {
    const onMouseUp = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      if (t.closest('input, textarea, select, [contenteditable="true"]')) return;
      const root = wrapperRef.current;
      if (root?.contains(t)) {
        setTimeout(focus, 0);
      }
    };
    document.addEventListener('mouseup', onMouseUp);
    return () => document.removeEventListener('mouseup', onMouseUp);
  }, [focus]);

  return { wrapperRef, inputRef, focus };
}

export function useStickyScroll(
  trigger: number,
): RefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement>(null);
  const sticky = useRef(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const nearBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight < 24;
      sticky.current = nearBottom;
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !sticky.current) return;
    el.scrollTop = el.scrollHeight;
  }, [trigger]);

  return ref;
}

export function useConsoleCommands(
  registry: readonly CommandSpec[],
): readonly CommandSpec[] {
  return useMemo(() => registry.filter((c) => !c.hidden), [registry]);
}
