"use client";

import { useMemo, useState } from "react";
import { ReactFlowProvider } from "@xyflow/react";

import type { WorkflowDefinition, WorkflowExecution, JkdmCapabilitySnapshot } from "./types/workflow";
import { useWorkflowEditor } from "./hooks/use-workflow-editor";
import { useWorkflowValidation } from "./hooks/use-workflow-validation";
import { useWorkflowShortcuts } from "./hooks/use-workflow-shortcuts";
import type { SaveStatus } from "./hooks/use-workflow-autosave";
import type { RecordManualResponseArgs, SubmitApprovalArgs } from "./lib/workflow-executor";

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
  onSave: (args: { id: string; version: number; definition: WorkflowDefinition }) => Promise<{ version: number }>;
  onRun: (triggerPayload?: unknown) => Promise<void>;
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
}

function WorkflowStudioInner({
  workflowId, initialDefinition, initialName, initialVersion,
  onSave, onRun, saveStatus, running, execution, executionError,
  jkdmCaps, manualNodeId, onMarkDirty, onHistory,
  onSubmitApproval, onRecordManualResponse,
}: WorkflowStudioProps) {
  const [name, setName] = useState(initialName);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [version] = useState(initialVersion);

  const editor = useWorkflowEditor(initialDefinition);
  const definition = useMemo(
    () => editor.toDefinition(initialDefinition.viewport),
    [editor, initialDefinition.viewport],
  );
  const validation = useWorkflowValidation(definition, jkdmCaps ?? undefined);
  const selectedNode = useMemo(
    () => editor.nodes.find((n) => n.id === selectedNodeId) ?? null,
    [editor.nodes, selectedNodeId],
  );

  const handleSave = async () => { await onSave({ id: workflowId, version, definition }); };

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
        onNameChange={(n) => { setName(n); onMarkDirty(); }}
        saveStatus={saveStatus}
        onSave={() => { void handleSave(); }}
        onRun={() => { void onRun(); }}
        onHistory={() => onHistory?.()}
        running={running}
        runnable={validation.isValid}
        validationSummary={{ errors: validation.errors.length, warnings: validation.warnings.length }}
        jkdmCaps={jkdmCaps}
      />
      <div className="flex min-h-0 flex-1">
        <WorkflowSidebar jkdmCaps={jkdmCaps ?? undefined} />
        <div className="min-w-0 flex-1">
          <WorkflowCanvas
            nodes={editor.nodes} edges={editor.edges}
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
        error={executionError}
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
