"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { WorkflowDefinition } from "../types/workflow";

export type SaveStatus = "saved" | "unsaved" | "saving" | "error";

export interface UseWorkflowAutosaveOptions {
  workflowId: string;
  currentVersion: number;
  definition: WorkflowDefinition;
  save: (args: { id: string; version: number; definition: WorkflowDefinition }) => Promise<{ version: number }>;
  debounceMs?: number;
}

export interface UseWorkflowAutosaveResult {
  status: SaveStatus;
  version: number;
  error: string | null;
  saveNow: () => Promise<void>;
  markDirty: () => void;
}

export function useWorkflowAutosave({ workflowId, currentVersion, definition, save, debounceMs = 1500 }: UseWorkflowAutosaveOptions): UseWorkflowAutosaveResult {
  const [status, setStatus] = useState<SaveStatus>("saved");
  const [version, setVersion] = useState(currentVersion);
  const [error, setError] = useState<string | null>(null);
  const latest = useRef(definition); latest.current = definition;
  const inFlight = useRef<Promise<void> | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const queued = useRef(false);

  const saveNow = useCallback(async () => {
    if (inFlight.current) { queued.current = true; return; }
    setStatus("saving"); setError(null);
    const attempt = save({ id: workflowId, version, definition: latest.current });
    inFlight.current = attempt.then(
      (r) => { setVersion(r.version); setStatus("saved"); inFlight.current = null; },
      (e) => { setError((e as Error).message); setStatus("error"); inFlight.current = null; },
    );
    await inFlight.current;
    if (queued.current) { queued.current = false; await saveNow(); }
  }, [save, workflowId, version]);

  const markDirty = useCallback(() => {
    setStatus("unsaved");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => { void saveNow(); }, debounceMs);
  }, [saveNow, debounceMs]);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  return { status, version, error, saveNow, markDirty };
}
