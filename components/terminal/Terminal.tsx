'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import {
  ASCII_BANNER,
  DEFAULT_GREETING,
  SHELL_HEADER,
} from './constants';
import {
  useAutocomplete,
  useFocusOnClick,
  useHistory,
  useStickyScroll,
} from './hooks';
import { COMMANDS, resolveCommand } from './commands';
import {
  errorMessage,
  formatTime,
  newLineId,
  toLine,
  tokenize,
} from './utils';
import TerminalBody from './TerminalBody';
import TerminalHeader from './TerminalHeader';
import TerminalPrompt from './TerminalPrompt';
import TerminalSuggestions from './TerminalSuggestions';
import type {
  LineKind,
  TerminalLine,
  TerminalProps,
} from './types';

const COMMAND_NAMES = COMMANDS.filter((c) => !c.hidden).map((c) => c.name);

export default function Terminal({
  context,
  height = 240,
  greeting,
  onCommand,
  className = '',
  showBanner = true,
}: TerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>(() => {
    const initial: TerminalLine[] = [];
    if (showBanner) {
      initial.push({
        id: newLineId(),
        kind: 'info',
        text: ASCII_BANNER.trimEnd(),
        time: Date.now(),
        source: 'shell',
      });
      initial.push({
        id: newLineId(),
        kind: 'info',
        text: SHELL_HEADER,
        time: Date.now(),
        source: 'shell',
      });
    }
    const greet = greeting ?? DEFAULT_GREETING;
    for (const g of greet) {
      initial.push({
        id: newLineId(),
        kind: 'info',
        text: g,
        time: Date.now(),
        source: 'shell',
      });
    }
    return initial;
  });

  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);

  const history = useHistory();
  const autocomplete = useAutocomplete(COMMANDS, resolveCommand);
  const { wrapperRef, inputRef, focus } = useFocusOnClick<HTMLDivElement>();
  const bodyRef = useStickyScroll(lines.length);

  const [running, setRunning] = useState<boolean>(() => context.isRunning());
  useEffect(() => {
    const id = window.setInterval(() => setRunning(context.isRunning()), 300);
    return () => window.clearInterval(id);
  }, [context]);

  useEffect(() => {
    const id = window.setTimeout(focus, 30);
    return () => window.clearTimeout(id);
  }, [focus]);

  const pushLine = useCallback((line: Omit<TerminalLine, 'id' | 'time'>) => {
    setLines((prev) => [
      ...prev,
      { ...line, id: newLineId(), time: Date.now() },
    ]);
  }, []);

  const pushLines = useCallback((outs: ReturnType<typeof toLine>[]) => {
    setLines((prev) => [
      ...prev,
      ...outs.map((o) => ({
        id: newLineId(),
        time: Date.now(),
        kind: o.kind,
        text: o.text,
      })),
    ]);
  }, []);

  const clearTranscript = useCallback(() => setLines([]), []);

  const exportTranscript = useCallback(() => {
    const text = lines
      .map(
        (l) =>
          `[${formatTime(l.time)}] ${l.kind.toUpperCase()} ${
            typeof l.text === 'string' ? l.text : '[rich]'
          }`,
      )
      .join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `twinforge-terminal-${Date.now()}.log`;
    a.click();
    URL.revokeObjectURL(url);
  }, [lines]);

  const dispatch = useCallback(
    async (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed) return;

      const tokens = tokenize(trimmed);
      const [name, ...args] = tokens;
      const spec = resolveCommand(name);

      pushLine({ kind: 'input', text: trimmed, source: 'user' });
      history.push(trimmed);

      if (!spec) {
        pushLines([toLine({ kind: 'error', text: `command not found: ${name}` })]);
        pushLines([
          toLine({
            kind: 'info',
            text: 'type `help` to see available commands',
          }),
        ]);
        onCommand?.(trimmed, null);
        return;
      }

      setBusy(true);
      try {
        const out = await spec.handler(args, context);

        if (out.clear) {
          setLines([]);
        }

        if (!out.silent && out.lines?.length) {
          const rendered = out.lines.map((l) => {
            if (typeof l === 'string') return toLine(l);
            if (
              l &&
              typeof l === 'object' &&
              'text' in l &&
              typeof (l as { text: unknown }).text === 'string'
            ) {
              const obj = l as { text: string; kind?: LineKind };
              return toLine({ text: obj.text, kind: obj.kind });
            }
            return { kind: 'output' as LineKind, text: String(l) };
          });
          pushLines(rendered);
        }

        if (out.hint) {
          pushLines([toLine({ kind: 'info', text: `hint: ${out.hint}` })]);
        }

        onCommand?.(trimmed, spec);
      } catch (err) {
        pushLines([toLine({ kind: 'error', text: `exception: ${errorMessage(err)}` })]);
        onCommand?.(trimmed, spec);
      } finally {
        setBusy(false);
      }
    },
    [context, history, onCommand, pushLine, pushLines],
  );

  const onKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const value = input;
        setInput('');
        autocomplete.clearGhost();
        void dispatch(value);
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const next = history.up();
        if (next !== undefined) setInput(next);
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = history.down();
        if (next !== undefined) setInput(next);
        return;
      }

      if (e.key === 'Tab') {
        e.preventDefault();
        const { apply, candidates } = autocomplete.complete(input);
        if (apply) {
          setInput(apply);
          autocomplete.clearGhost();
        } else if (candidates?.length) {
          pushLines([toLine({ kind: 'info', text: candidates.join('  ') })]);
        }
        return;
      }

      if (e.ctrlKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        clearTranscript();
        return;
      }

      if (e.ctrlKey && e.key.toLowerCase() === 'c') {
        if (!input) return;
        e.preventDefault();
        pushLine({ kind: 'input', text: `${input}^C`, source: 'user' });
        setInput('');
        autocomplete.clearGhost();
        return;
      }

      if (e.ctrlKey && e.key.toLowerCase() === 'u') {
        e.preventDefault();
        setInput('');
        autocomplete.clearGhost();
        return;
      }
    },
    [
      input,
      history,
      dispatch,
      autocomplete,
      pushLine,
      pushLines,
      clearTranscript,
    ],
  );

  useEffect(() => {
    if (!input) {
      autocomplete.clearGhost();
      return;
    }
    autocomplete.complete(input);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  const handleCopy = useCallback((text: string) => {
    void navigator.clipboard?.writeText(text);
  }, []);

  const mode = context.getMode();
  const commandNames = useMemo(() => [...COMMAND_NAMES].sort(), []);

  return (
    <div
      ref={wrapperRef}
      onClick={focus}
      className={
        'flex min-h-0 flex-col border-t border-[var(--color-line)] ' +
        'bg-[#060809] ' +
        className
      }
      style={{ height }}
    >
      <TerminalHeader
        running={running}
        onClear={clearTranscript}
        onExport={exportTranscript}
      />

      <TerminalBody
        bodyRef={bodyRef}
        lines={lines}
        busy={busy}
        onCopy={handleCopy}
      />

      <TerminalSuggestions
        input={input}
        commandNames={commandNames}
        onPick={(v) => {
          setInput(v);
          autocomplete.clearGhost();
          inputRef.current?.focus();
        }}
      />

      <TerminalPrompt
        inputRef={inputRef}
        mode={mode}
        value={input}
        onChange={setInput}
        onKeyDown={onKeyDown}
        busy={busy}
        ghost={autocomplete.ghost}
      />
    </div>
  );
}
