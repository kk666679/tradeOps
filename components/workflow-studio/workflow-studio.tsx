"use client";

import { useMemo, useState } from "react";
import { ReactFlowProvider } from "@xyflow/react";

import type { WorkflowDefinition, WorkflowExecution, JkdmCapabilitySnapshot } from "./types/workflow";
import { useWorkflowEditor } from "./hooks/use-workflow-editor";
import { useWorkflowValidation } from "./hooks/use-workflow-validation";
import { useWorkflowShortcuts } from "./hooks/use-workflow-shortcuts";
import type { SaveStatus } from "./hooks/use-workflow-autosave";
import type { RecordManualResponseArgs, SubmitApprovalArgs } from "./lib/workflow-executor";
import { buildWorkflowNodeTypeRegistry, ENGINE_NODE_TYPES } from "./nodes/node-types";

import { WorkflowToolbar } from "./ui/workflow-toolbar";
import { WorkflowCanvas } from "./ui/workflow-canvas";
import { WorkflowSidebar } from "./ui/workflow-sidebar";
import { WorkflowInspector } from "./ui/workflow-inspector";
import { WorkflowConsole } from "./ui/workflow-console";
import { IntegrationBanner } from "./runtime/integration-banner";

export interface WorkflowStudioProps {
  workflowId: string;
  initialDefinition: WorkflowDefinition;
  initialName: string;
  initialVersion: number;
  onSave?: (args: { id: string; version: number; definition: WorkflowDefinition }) => Promise<{ version: number }>;
  onRun?: (triggerPayload?: unknown) => Promise<void>;
  onSaveGraph?: (args: {
    id: string;
    version: number;
    name?: string;
    graph: Pick<WorkflowDefinition, "nodes" | "edges">;
  }) => Promise<{ id: string; version: number }>;
  onRunGraph?: (args: {
    id: string;
    name?: string;
    graph: Pick<WorkflowDefinition, "nodes" | "edges">;
  }) => Promise<void>;
  saveStatus: SaveStatus;
  running: boolean;
  execution: WorkflowExecution | null;
  executionError: string | null;
  jkdmCaps: JkdmCapabilitySnapshot | null;
  manualNodeId?: string;
  onMarkDirty: () => void;
  onHistory?: () => void;
  onSubmitApproval?: (args: Omit<SubmitApprovalArgs, "executionId">) => Promise<void>;
  onRecordManualResponse?: (args: Omit<RecordManualResponseArgs, "executionId">) => Promise<void>;
  supportedNodeTypes?: ReadonlySet<string>;
  executableNodeTypes?: ReadonlySet<string>;
}

function WorkflowStudioInner({
  workflowId, initialDefinition, initialName, initialVersion,
  onSave, onRun, onSaveGraph, onRunGraph, saveStatus, running, execution, executionError,
  jkdmCaps, manualNodeId, onMarkDirty, onHistory,
  onSubmitApproval, onRecordManualResponse,
  supportedNodeTypes, executableNodeTypes,
}: WorkflowStudioProps) {
  const [name, setName] = useState(initialName);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [version] = useState(initialVersion);

  const editor = useWorkflowEditor(initialDefinition, supportedNodeTypes);
  const nodeTypes = useMemo(
    () => buildWorkflowNodeTypeRegistry(supportedNodeTypes),
    [supportedNodeTypes],
  );
  const definition = useMemo(
    () => editor.toDefinition(initialDefinition.viewport),
    [editor, initialDefinition.viewport],
  );
  const validation = useWorkflowValidation(
    definition,
    jkdmCaps ?? undefined,
    executableNodeTypes ?? ENGINE_NODE_TYPES,
  );
  const selectedNode = useMemo(
    () => editor.nodes.find((n) => n.id === selectedNodeId) ?? null,
    [editor.nodes, selectedNodeId],
  );

  const graph = { nodes: definition.nodes, edges: definition.edges };
  const handleSave = async () => {
    try {
      if (onSaveGraph) await onSaveGraph({ id: workflowId, version, name, graph });
      else if (onSave) await onSave({ id: workflowId, version, definition });
      else throw new Error("Workflow save is not configured.");
      setActionError(null);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Workflow save failed.");
    }
  };
  const handleRun = async () => {
    try {
      if (onRunGraph) await onRunGraph({ id: workflowId, name, graph });
      else if (onRun) await onRun();
      else throw new Error("Workflow run is not configured.");
      setActionError(null);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Workflow run failed.");
    }
  };
  useWorkflowShortcuts({
    onSave: () => { void handleSave(); },
    onDelete: () => { if (selectedNodeId) { editor.removeNode(selectedNodeId); setSelectedNodeId(null); } },
    onEscape: () => setSelectedNodeId(null),
    onDuplicate: () => { if (selectedNodeId) editor.duplicateNode(selectedNodeId); },
  });

  return (
    <div className="flex h-full flex-col">
      <IntegrationBanner caps={jkdmCaps} />
      <WorkflowToolbar
        name={name}
        onNameChange={(n) => { setName(n); setActionError(null); onMarkDirty(); }}
        saveStatus={saveStatus}
        onSave={() => { void handleSave(); }}
        onRun={() => { void handleRun(); }}
        onHistory={() => onHistory?.()}
        running={running}
        runnable={validation.isValid}
        validationSummary={{ errors: validation.errors.length, warnings: validation.warnings.length }}
        jkdmCaps={jkdmCaps}
      />
      {validation.errors.length > 0 && (
        <section
          className="max-h-24 shrink-0 overflow-y-auto border-b border-red-500/30 bg-red-950/20 px-4 py-2"
          aria-label="Workflow validation errors"
          aria-live="polite"
        >
          <p className="font-mono text-[10px] font-semibold uppercase text-red-300">
            Run blocked: {validation.errors.length} validation error{validation.errors.length === 1 ? "" : "s"}
          </p>
          <ul className="mt-1 flex flex-col gap-1">
            {validation.errors.map((issue, index) => (
              <li key={`${issue.code}-${issue.nodeId ?? issue.edgeId ?? index}`}>
                {issue.nodeId ? (
                  <button
                    type="button"
                    onClick={() => setSelectedNodeId(issue.nodeId ?? null)}
                    className="text-left font-mono text-[10px] text-red-200 underline decoration-red-500/40 underline-offset-2"
                  >
                    {issue.message}
                  </button>
                ) : (
                  <span className="font-mono text-[10px] text-red-200">{issue.message}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
      <div className="flex min-h-0 flex-1">
        <WorkflowSidebar jkdmCaps={jkdmCaps ?? undefined} supportedTypes={supportedNodeTypes} />
        <div className="min-w-0 flex-1">
          <WorkflowCanvas
            nodes={editor.nodes} edges={editor.edges} nodeTypes={nodeTypes}
            onNodesChange={(c) => { editor.onNodesChange(c); onMarkDirty(); }}
            onEdgesChange={(c) => { editor.onEdgesChange(c); onMarkDirty(); }}
            onConnect={(c) => { editor.onConnect(c); onMarkDirty(); }}
            isValidConnection={editor.isValidConnection}
            onNodeClick={(n) => setSelectedNodeId(n.id)}
            onPaneClick={() => setSelectedNodeId(null)}
            onDropNode={(type, pos) => { editor.addNodeAt(type, pos); onMarkDirty(); }}
          />
        </div>
        <WorkflowInspector
          selectedNode={selectedNode}
          validation={validation}
          jkdmCaps={jkdmCaps}
          onChange={(id, patch) => { editor.updateNode(id, patch); onMarkDirty(); }}
          onDelete={(id) => { editor.removeNode(id); setSelectedNodeId(null); onMarkDirty(); }}
          onDuplicate={(id) => { editor.duplicateNode(id); onMarkDirty(); }}
        />
      </div>
      <WorkflowConsole
        execution={execution}
        running={running}
        error={executionError ?? actionError}
        onSelectNode={(id) => setSelectedNodeId(id)}
        onRecordManualResponse={onRecordManualResponse}
        manualNodeId={manualNodeId}
      />
    </div>
  );
}

export function WorkflowStudio(props: WorkflowStudioProps) {
  return <ReactFlowProvider><WorkflowStudioInner {...props} /></ReactFlowProvider>;
}

export default WorkflowStudio;

export { WorkflowStudio as WorkflowStudioEntry } from './WorkflowStudio';
