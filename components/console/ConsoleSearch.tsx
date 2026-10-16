'use client';

import { useEffect, useRef } from 'react';

export interface ConsoleSearchProps {
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  placeholder?: string;
  className?: string;
}

export default function ConsoleSearch({
  value,
  onChange,
  hint = '/',
  placeholder = 'filter…',
  className = '',
}: ConsoleSearchProps) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const tag = t?.tagName?.toLowerCase();
      const editing =
        tag === 'input' || tag === 'textarea' || t?.isContentEditable;
      if (e.key === '/' && !editing) {
        e.preventDefault();
        ref.current?.focus();
      }
      if (e.key === 'Escape' && document.activeElement === ref.current) {
        if (value) {
          e.preventDefault();
          onChange('');
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [value, onChange]);

  return (
    <div className={'relative ' + className}>
      <input
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        autoComplete="off"
        className={
          'w-44 rounded border border-[var(--color-line)] bg-[var(--color-bg-input)] ' +
          'py-1 pl-6 pr-7 text-[10.5px] text-[var(--color-text)] ' +
          'placeholder:text-[var(--color-text-4)] focus:border-[var(--color-blue)] focus:outline-none'
        }
      />
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="pointer-events-none absolute left-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-[var(--color-text-4)]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
      {value ? (
        <button
          onClick={() => onChange('')}
          title="Clear search (Esc)"
          className="absolute right-1 top-1/2 -translate-y-1/2 rounded p-[2px] text-[var(--color-text-4)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text)]"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      ) : hint ? (
        <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 rounded border border-[var(--color-line-2)] px-1 text-[9px] text-[var(--color-text-4)]">
          {hint}
        </span>
      ) : null}
    </div>
  );
}
