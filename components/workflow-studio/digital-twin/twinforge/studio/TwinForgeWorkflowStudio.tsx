"use client";

import { useEffect, useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { WorkflowStudio } from "@/components/workflow-studio/workflow-studio";
import type { SaveStatus } from "@/components/workflow-studio/hooks/use-workflow-autosave";
import {
  WorkflowDefinitionSchema,
  type WorkflowDefinition,
} from "@/components/workflow-studio/types/workflow";

const NEW_WORKFLOW_ID = "__new__";
const TWINFORGE_SUPPORTED = new Set([
  "trigger.manual",
  "data.transform",
  "logic.condition",
  "output",
]);

const EMPTY_DEFINITION: WorkflowDefinition = {
  nodes: [
    {
      id: "manual-trigger",
      type: "trigger.manual",
      position: { x: 80, y: 110 },
      label: "Manual input",
      config: {},
    },
    {
      id: "workflow-output",
      type: "output",
      position: { x: 430, y: 110 },
      label: "Outcome",
      config: {},
    },
  ],
  edges: [{
    id: "trigger-to-output",
    source: "manual-trigger",
    target: "workflow-output",
    sourceHandle: "out",
    targetHandle: "in",
  }],
  viewport: { x: 0, y: 0, zoom: 1 },
};

type ImportedRecord = { recordId: string; payload: unknown };
type Preview = {
  total: number;
  valid: number;
  invalid: number;
  records: Array<{
    recordId: string;
    payload: unknown;
    status: "VALID" | "INVALID";
    validationErrors: Array<{ field?: string; message: string }>;
  }>;
};

function parseJsonObject(value: string, label: string): Record<string, unknown> | undefined {
  if (!value.trim()) return undefined;
  const parsed: unknown = JSON.parse(value);
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`${label} must be a JSON object.`);
  }
  return parsed as Record<string, unknown>;
}

function parseRecords(value: string): ImportedRecord[] {
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("Records must be a non-empty JSON array.");
  }
  return parsed.map((candidate, index) => {
    if (candidate === null || typeof candidate !== "object" || Array.isArray(candidate)) {
      throw new Error(`Record ${index + 1} must be an object.`);
    }
    const record = candidate as Record<string, unknown>;
    if (typeof record.recordId !== "string" || !record.recordId.trim() || !("payload" in record)) {
      throw new Error(`Record ${index + 1} needs a recordId and payload.`);
    }
    return { recordId: record.recordId, payload: record.payload };
  });
}

function statusColor(status: string): string {
  if (status === "SUCCEEDED" || status === "VALID") return "text-emerald-300";
  if (status === "FAILED" || status === "INVALID") return "text-red-300";
  if (status === "RUNNING" || status === "RETRYING" || status === "CANCELLING") return "text-amber-300";
  return "text-slate-400";
}

export function TwinForgeWorkflowStudio() {
  const utils = trpc.useUtils();
  const workflowsQuery = trpc.customAgents.orchestration.listWorkflows.useQuery({ take: 100 });
  const datasetsQuery = trpc.customAgents.orchestration.seed.listDatasets.useQuery(undefined);
  const saveDraft = trpc.customAgents.orchestration.saveDraft.useMutation();
  const createDataset = trpc.customAgents.orchestration.seed.createDataset.useMutation();
  const previewRecords = trpc.customAgents.orchestration.seed.previewRecords.useMutation();
  const addRecords = trpc.customAgents.orchestration.seed.addRecords.useMutation();
  const startLoop = trpc.customAgents.orchestration.seed.startLoop.useMutation();
  const cancelLoop = trpc.customAgents.orchestration.seed.cancelLoopRun.useMutation();

  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const [creatingWorkflow, setCreatingWorkflow] = useState(false);
  const [datasetId, setDatasetId] = useState("");
  const [runId, setRunId] = useState("");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [actionError, setActionError] = useState<string | null>(null);
  const [datasetName, setDatasetName] = useState("");
  const [schemaText, setSchemaText] = useState("");
  const [recordsText, setRecordsText] = useState("[]");
  const [preview, setPreview] = useState<Preview | null>(null);
  const [panel, setPanel] = useState<"seeds" | "history">("seeds");

  useEffect(() => {
    if (!workflowId && workflowsQuery.data?.length) {
      setWorkflowId(workflowsQuery.data[0]?.id ?? null);
    }
  }, [workflowId, workflowsQuery.data]);

  const workflowQuery = trpc.customAgents.orchestration.getWorkflow.useQuery(
    { workflowId: workflowId ?? "" },
    { enabled: Boolean(workflowId && !creatingWorkflow) },
  );
  const datasetQuery = trpc.customAgents.orchestration.seed.getDataset.useQuery(
    { datasetId },
    { enabled: Boolean(datasetId) },
  );
  const historyQuery = trpc.customAgents.orchestration.seed.listLoopRuns.useQuery({
    workflowId: workflowId && !creatingWorkflow ? workflowId : undefined,
    take: 20,
  });
  const runQuery = trpc.customAgents.orchestration.seed.getLoopRun.useQuery(
    { runId },
    {
      enabled: Boolean(runId),
      refetchInterval: (query) => {
        const status = query.state.data?.run.status;
        return status === "QUEUED" || status === "RUNNING" || status === "CANCELLING" ? 2000 : false;
      },
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: true,
      staleTime: 0,
    },
  );

  const parsedWorkflow = useMemo(() => {
    if (creatingWorkflow) return { success: true as const, data: EMPTY_DEFINITION };
    if (!workflowQuery.data) return null;
    return WorkflowDefinitionSchema.safeParse(workflowQuery.data.definition);
  }, [creatingWorkflow, workflowQuery.data]);

  const currentRun = runQuery.data?.run;
  const runIsActive = currentRun?.status === "QUEUED"
    || currentRun?.status === "RUNNING"
    || currentRun?.status === "CANCELLING";
  const loopProgress = currentRun
    ? currentRun.doneIterations + currentRun.failedIterations
    : 0;

  const chooseWorkflow = (value: string) => {
    setActionError(null);
    setRunId("");
    if (value === NEW_WORKFLOW_ID) {
      setCreatingWorkflow(true);
      setWorkflowId(NEW_WORKFLOW_ID);
      setSaveStatus("unsaved");
      return;
    }
    setCreatingWorkflow(false);
    setWorkflowId(value);
    setSaveStatus("saved");
  };

  const persistGraph = async (args: {
    id: string;
    version: number;
    name?: string;
    graph: Pick<WorkflowDefinition, "nodes" | "edges">;
  }) => {
    if (!parsedWorkflow?.success) throw new Error("Workflow definition could not be loaded.");
    setSaveStatus("saving");
    setActionError(null);
    try {
      const result = await saveDraft.mutateAsync({
        workflowId: args.id === NEW_WORKFLOW_ID ? undefined : args.id,
        expectedUpdatedAt: args.id === NEW_WORKFLOW_ID ? undefined : workflowQuery.data?.updatedAt,
        name: args.name?.trim() || "Untitled workflow",
        description: creatingWorkflow ? "" : workflowQuery.data?.description ?? "",
        definition: {
          ...parsedWorkflow.data,
          nodes: args.graph.nodes,
          edges: args.graph.edges,
        },
      });
      setWorkflowId(result.id);
      setCreatingWorkflow(false);
      setSaveStatus("saved");
      await Promise.all([
        utils.customAgents.orchestration.listWorkflows.invalidate(),
        utils.customAgents.orchestration.getWorkflow.invalidate({ workflowId: result.id }),
      ]);
      return { id: result.id, version: args.version };
    } catch (error) {
      setSaveStatus("error");
      setActionError(error instanceof Error ? error.message : "Workflow save failed.");
      throw error;
    }
  };

  const runGraph = async (args: {
    id: string;
    name?: string;
    graph: Pick<WorkflowDefinition, "nodes" | "edges">;
  }) => {
    if (!datasetId) throw new Error("Select a seed dataset before running this workflow.");
    const saved = await persistGraph({ ...args, version: 1 });
    const run = await startLoop.mutateAsync({
      workflowId: saved.id,
      seedDatasetId: datasetId,
      loopConfig: {
        strategy: "sequential",
        batchSize: 1,
        continueOnError: true,
        maxRetries: 1,
        backoffMs: 1000,
      },
    });
    setRunId(run.id);
    setPanel("history");
    await utils.customAgents.orchestration.seed.listLoopRuns.invalidate();
  };

  const handleCreateDataset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setActionError(null);
    try {
      const schema = parseJsonObject(schemaText, "JSON Schema");
      const created = await createDataset.mutateAsync({
        name: datasetName.trim(),
        ...(schema ? { schema } : {}),
      });
      setDatasetId(created.id);
      setDatasetName("");
      setPreview(null);
      await utils.customAgents.orchestration.seed.listDatasets.invalidate();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Dataset creation failed.");
    }
  };

  const handlePreview = async () => {
    setActionError(null);
    try {
      const records = parseRecords(recordsText);
      const schema = datasetQuery.data?.schema
        ? datasetQuery.data.schema as Record<string, unknown>
        : parseJsonObject(schemaText, "JSON Schema");
      const result = await previewRecords.mutateAsync({
        records,
        ...(schema ? { schema } : {}),
      });
      setPreview(result);
    } catch (error) {
      setPreview(null);
      setActionError(error instanceof Error ? error.message : "Seed preview failed.");
    }
  };

  const handleImport = async () => {
    if (!datasetId || !preview) return;
    setActionError(null);
    try {
      const records = preview.records.map(({ recordId, payload }) => ({ recordId, payload }));
      await addRecords.mutateAsync({ datasetId, records });
      await Promise.all([
        utils.customAgents.orchestration.seed.listDatasets.invalidate(),
        utils.customAgents.orchestration.seed.getDataset.invalidate({ datasetId }),
      ]);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Seed import failed.");
    }
  };

  const handleCancel = async () => {
    if (!runId) return;
    try {
      await cancelLoop.mutateAsync({ runId });
      await utils.customAgents.orchestration.seed.getLoopRun.invalidate({ runId });
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Cancellation request failed.");
    }
  };

  if (workflowsQuery.isPending || datasetsQuery.isPending) {
    return <div className="p-6 font-mono text-xs text-slate-400" role="status">Loading workflows and seed datasets…</div>;
  }
  if (workflowsQuery.error || datasetsQuery.error) {
    return <div className="p-6 font-mono text-xs text-red-300" role="alert">{workflowsQuery.error?.message ?? datasetsQuery.error?.message}</div>;
  }
  if (!workflowId && !creatingWorkflow) {
    return (
      <main className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-lg font-semibold text-slate-100">TwinForge workflows</h1>
        <p className="font-mono text-xs text-slate-400">No persisted workflows in this tenant.</p>
        <button type="button" onClick={() => chooseWorkflow(NEW_WORKFLOW_ID)} className="rounded border border-emerald-500/50 px-3 py-2 text-sm text-emerald-200 hover:bg-emerald-500/10">Create workflow</button>
      </main>
    );
  }
  if (!creatingWorkflow && workflowQuery.isPending) {
    return <div className="p-6 font-mono text-xs text-slate-400" role="status">Loading workflow definition…</div>;
  }
  if (workflowQuery.error) {
    return <div className="p-6 font-mono text-xs text-red-300" role="alert">{workflowQuery.error.message}</div>;
  }
  if (!parsedWorkflow?.success) {
    return <div className="p-6 font-mono text-xs text-red-300" role="alert">Workflow definition is malformed and was not changed.</div>;
  }

  const initialDefinition = parsedWorkflow.data;
  const initialName = creatingWorkflow ? "Untitled workflow" : workflowQuery.data?.name ?? "Untitled workflow";
  const activeDataset = datasetQuery.data;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex flex-wrap items-center gap-2 border-b border-slate-800 bg-slate-950 px-3 py-2">
        <div className="mr-2 min-w-40">
          <h1 className="text-sm font-semibold text-slate-100">Workflow studio</h1>
          <p className="font-mono text-[9px] uppercase text-slate-500">Persisted orchestration</p>
        </div>
        <label className="sr-only" htmlFor="twinforge-workflow">Workflow</label>
        <select id="twinforge-workflow" value={creatingWorkflow ? NEW_WORKFLOW_ID : workflowId ?? ""} onChange={(event) => chooseWorkflow(event.target.value)} className="max-w-64 rounded border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-slate-100">
          <option value={NEW_WORKFLOW_ID}>New workflow</option>
          {(workflowsQuery.data ?? []).map((workflow) => <option key={workflow.id} value={workflow.id}>{workflow.name}</option>)}
        </select>
        <button type="button" onClick={() => chooseWorkflow(NEW_WORKFLOW_ID)} className="rounded border border-slate-700 px-2 py-1.5 text-xs text-slate-300 hover:bg-slate-800">New</button>
        <label className="ml-auto font-mono text-[9px] uppercase text-slate-500" htmlFor="seed-dataset">Seed dataset</label>
        <select id="seed-dataset" value={datasetId} onChange={(event) => { setDatasetId(event.target.value); setPreview(null); }} className="max-w-52 rounded border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-slate-100">
          <option value="">Select dataset</option>
          {(datasetsQuery.data ?? []).map((dataset) => <option key={dataset.id} value={dataset.id}>{dataset.name} ({dataset.recordCount})</option>)}
        </select>
      </header>

      {actionError && <div className="border-b border-red-500/30 bg-red-950/30 px-3 py-1.5 font-mono text-[10px] text-red-200" role="alert">{actionError}</div>}

      <div className="flex min-h-0 flex-1">
        <div className="min-w-0 flex-1">
          <WorkflowStudio
            key={`${workflowId ?? "new"}-${creatingWorkflow ? "new" : "saved"}`}
            workflowId={workflowId ?? NEW_WORKFLOW_ID}
            initialDefinition={initialDefinition}
            initialName={initialName}
            initialVersion={1}
            onSaveGraph={persistGraph}
            onRunGraph={runGraph}
            saveStatus={saveStatus}
            running={Boolean(startLoop.isPending || runIsActive)}
            execution={null}
            executionError={runQuery.error?.message ?? null}
            jkdmCaps={null}
            onMarkDirty={() => setSaveStatus("unsaved")}
            onHistory={() => setPanel("history")}
            supportedNodeTypes={TWINFORGE_SUPPORTED}
          />
        </div>

        <aside className="flex w-[min(34vw,360px)] shrink-0 flex-col border-l border-slate-800 bg-slate-950" aria-label="Seed and execution monitor">
          <div className="flex border-b border-slate-800">
            <button type="button" onClick={() => setPanel("seeds")} aria-pressed={panel === "seeds"} className={`flex-1 px-3 py-2 font-mono text-[10px] uppercase ${panel === "seeds" ? "border-b-2 border-emerald-400 text-emerald-200" : "text-slate-500"}`}>Seeds</button>
            <button type="button" onClick={() => setPanel("history")} aria-pressed={panel === "history"} className={`flex-1 px-3 py-2 font-mono text-[10px] uppercase ${panel === "history" ? "border-b-2 border-emerald-400 text-emerald-200" : "text-slate-500"}`}>Runs</button>
          </div>

          {panel === "seeds" ? (
            <div className="min-h-0 flex-1 overflow-y-auto p-3">
              {activeDataset ? (
                <div className="mb-3 flex items-center justify-between gap-2 font-mono text-[10px] text-slate-400">
                  <span className="truncate">{activeDataset.name}</span>
                  <span>{activeDataset.recordCount} records</span>
                </div>
              ) : <p className="mb-3 font-mono text-[10px] text-slate-500">No dataset selected.</p>}
              {datasetQuery.error && <p role="alert" className="mb-2 font-mono text-[10px] text-red-300">{datasetQuery.error.message}</p>}
              <details className="border-y border-slate-800 py-2">
                <summary className="cursor-pointer font-mono text-[10px] uppercase text-slate-300">Create dataset</summary>
                <form onSubmit={(event) => void handleCreateDataset(event)} className="mt-2 flex flex-col gap-2">
                  <input value={datasetName} onChange={(event) => setDatasetName(event.target.value)} required maxLength={200} placeholder="Dataset name" aria-label="Dataset name" className="rounded border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-slate-100" />
                  <textarea value={schemaText} onChange={(event) => setSchemaText(event.target.value)} rows={4} placeholder="Optional JSON Schema" aria-label="Dataset JSON Schema" className="resize-y rounded border border-slate-700 bg-slate-900 px-2 py-1.5 font-mono text-[10px] text-slate-200" />
                  <button type="submit" disabled={createDataset.isPending || !datasetName.trim()} className="self-start rounded border border-slate-700 px-2.5 py-1 text-xs text-slate-200 disabled:opacity-40">{createDataset.isPending ? "Creating…" : "Create"}</button>
                </form>
              </details>
              <div className="mt-3 flex flex-col gap-2">
                <label htmlFor="seed-records" className="font-mono text-[10px] uppercase text-slate-400">Import records</label>
                <textarea id="seed-records" value={recordsText} onChange={(event) => { setRecordsText(event.target.value); setPreview(null); }} rows={7} className="resize-y rounded border border-slate-700 bg-slate-900 px-2 py-1.5 font-mono text-[10px] text-slate-200" />
                <div className="flex gap-2">
                  <button type="button" disabled={previewRecords.isPending} onClick={() => void handlePreview()} className="rounded border border-slate-700 px-2.5 py-1 text-xs text-slate-200 disabled:opacity-40">{previewRecords.isPending ? "Validating…" : "Preview"}</button>
                  <button type="button" disabled={!datasetId || !preview || addRecords.isPending} onClick={() => void handleImport()} className="rounded bg-emerald-500 px-2.5 py-1 text-xs font-semibold text-emerald-950 disabled:opacity-40">{addRecords.isPending ? "Importing…" : "Import"}</button>
                </div>
              </div>
              {preview && (
                <section className="mt-3 border-t border-slate-800 pt-2" aria-label="Seed validation preview">
                  <div className="mb-2 flex justify-between font-mono text-[10px] text-slate-400">
                    <span>{preview.total} reviewed</span>
                    <span><span className="text-emerald-300">{preview.valid} valid</span> · <span className="text-red-300">{preview.invalid} invalid</span></span>
                  </div>
                  <ul className="divide-y divide-slate-800">
                    {preview.records.map((record) => (
                      <li key={record.recordId} className="py-2">
                        <div className="flex justify-between gap-2 font-mono text-[10px]">
                          <span className="truncate text-slate-200">{record.recordId}</span>
                          <span className={statusColor(record.status)}>{record.status}</span>
                        </div>
                        {record.validationErrors.map((validationError, index) => (
                          <p key={`${validationError.field ?? "record"}-${index}`} className="mt-1 font-mono text-[9px] text-red-300">{validationError.field} {validationError.message}</p>
                        ))}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {activeDataset && (
                <section className="mt-3 border-t border-slate-800 pt-2" aria-label="Persisted seed records">
                  <h2 className="mb-1 font-mono text-[10px] uppercase text-slate-400">Persisted records</h2>
                  <ul className="divide-y divide-slate-800">
                    {activeDataset.records.map((record) => (
                      <li key={record.id} className="flex justify-between gap-2 py-1.5 font-mono text-[9px]">
                        <span className="truncate text-slate-300">{record.recordId}</span>
                        <span className={statusColor(record.status)}>{record.status}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          ) : (
            <div className="min-h-0 flex-1 overflow-y-auto p-3">
              {historyQuery.error && <p role="alert" className="font-mono text-[10px] text-red-300">{historyQuery.error.message}</p>}
              {historyQuery.data?.length === 0 && <p className="font-mono text-[10px] text-slate-500">No runs for this workflow.</p>}
              <ul className="divide-y divide-slate-800">
                {(historyQuery.data ?? []).map((run) => (
                  <li key={run.id}>
                    <button type="button" onClick={() => setRunId(run.id)} className={`flex w-full items-center justify-between gap-2 py-2 text-left ${runId === run.id ? "text-emerald-200" : "text-slate-300"}`}>
                      <span className="min-w-0 truncate font-mono text-[10px]">{run.id.slice(0, 12)}</span>
                      <span className={`font-mono text-[9px] ${statusColor(run.status)}`}>{run.status}</span>
                      <span className="font-mono text-[9px] text-slate-500">{run.doneIterations + run.failedIterations}/{run.totalIterations}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <section className="max-h-[42%] shrink-0 overflow-y-auto border-t border-slate-800 p-3" aria-label="Persisted run monitor" aria-live="polite">
            {runQuery.isPending && runId && <p className="font-mono text-[10px] text-slate-500">Loading run…</p>}
            {runQuery.error && <p role="alert" className="font-mono text-[10px] text-red-300">{runQuery.error.message}</p>}
            {currentRun && (
              <>
                <div className="flex items-center justify-between gap-2">
                  <span className={`font-mono text-[10px] uppercase ${statusColor(currentRun.status)}`}>{currentRun.status}</span>
                  <span className="font-mono text-[9px] text-slate-500">{loopProgress}/{currentRun.totalIterations} settled</span>
                  {currentRun.status === "QUEUED" || currentRun.status === "RUNNING" ? (
                    <button type="button" onClick={() => void handleCancel()} disabled={cancelLoop.isPending} className="rounded border border-red-500/40 px-2 py-1 font-mono text-[9px] text-red-200 disabled:opacity-40">{cancelLoop.isPending ? "Requesting…" : "Cancel"}</button>
                  ) : currentRun.status === "CANCELLING" ? <span className="font-mono text-[9px] text-amber-300">Finishing active iteration</span> : null}
                </div>
                {currentRun.totalIterations > 0 && <progress className="mt-2 h-1.5 w-full accent-emerald-400" value={loopProgress} max={currentRun.totalIterations} aria-label="Persisted iteration progress" />}
                <ul className="mt-2 divide-y divide-slate-800">
                  {runQuery.data?.iterations.map((iteration) => (
                    <li key={iteration.id} className="py-2">
                      <div className="flex justify-between gap-2 font-mono text-[9px]">
                        <span className="truncate text-slate-300">{iteration.recordId}</span>
                        <span className={statusColor(iteration.status)}>{iteration.status} · attempt {iteration.attempt}</span>
                      </div>
                      {iteration.error && <p className="mt-1 break-words font-mono text-[9px] text-red-300">{iteration.error}</p>}
                      {iteration.output !== null && iteration.output !== undefined && <pre className="mt-1 max-h-20 overflow-auto whitespace-pre-wrap break-words font-mono text-[9px] text-slate-500">{JSON.stringify(iteration.output)}</pre>}
                    </li>
                  ))}
                </ul>
                <details className="mt-2 border-t border-slate-800 pt-2">
                  <summary className="cursor-pointer font-mono text-[9px] uppercase text-slate-400">Execution logs</summary>
                  <ul className="mt-1 space-y-1">
                    {runQuery.data?.logs.map((log) => (
                      <li key={log.id} className="font-mono text-[9px] text-slate-400"><span className={statusColor(log.level)}>{log.level}</span> {log.message}</li>
                    ))}
                  </ul>
                </details>
              </>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}