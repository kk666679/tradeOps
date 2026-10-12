"use client";

import { useEffect } from "react";

export interface WorkflowShortcutHandlers {
  onSave?: () => void;
  onDelete?: () => void;
  onEscape?: () => void;
  onDuplicate?: () => void;
}

export function useWorkflowShortcuts(handlers: WorkflowShortcutHandlers): void {
  useEffect(() => {
    const isTyping = (el: EventTarget | null): boolean => {
      if (!(el instanceof HTMLElement)) return false;
      const tag = el.tagName;
      return tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable;
    };
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "s") { e.preventDefault(); handlers.onSave?.(); return; }
      if (mod && e.key.toLowerCase() === "d" && !isTyping(e.target)) { e.preventDefault(); handlers.onDuplicate?.(); return; }
      if (e.key === "Escape") { handlers.onEscape?.(); return; }
      if ((e.key === "Delete" || e.key === "Backspace") && !isTyping(e.target)) handlers.onDelete?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handlers]);
}
