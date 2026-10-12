"use client";

import type { WorkflowNode } from "../types/workflow";
import { InspectorShell, InspectorField } from "./inspector-shell";
import { findCatalogEntry } from "../lib/node-catalog-helpers";

export interface GenericInspectorProps {
  node: WorkflowNode;
  onChange: (patch: Partial<WorkflowNode>) => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  capabilityWarning?: string;
}

export function GenericInspector({ node, onChange, onDelete, onDuplicate, capabilityWarning }: GenericInspectorProps) {
  const entry = findCatalogEntry(node.type);
  const c = (node.config ?? {}) as Record<string, unknown>;

  const patchConfig = (patch: Record<string, unknown>) =>
    onChange({ config: { ...node.config, ...patch } });

  return (
    <InspectorShell
      title={entry?.label ?? node.type}
      description={entry?.description}
      onDelete={onDelete}
      onDuplicate={onDuplicate}
    >
      {capabilityWarning && (
        <div className="rounded border border-red-500/25 bg-red-500/[0.06] px-2.5 py-1.5 font-mono text-[10px] text-red-400">
          {capabilityWarning}
        </div>
      )}

      <InspectorField label="Label">
        <input type="text" value={node.label ?? ""}
          onChange={(e) => onChange({ label: e.target.value })}
          className="rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-2 py-1.5 text-[12px]" />
      </InspectorField>

      {/* Per-type fields */}
      {node.type === "action.create_task" && (
        <>
          <InspectorField label="Title">
            <input type="text" value={String(c.title ?? "")}
              onChange={(e) => patchConfig({ title: e.target.value })}
              className="rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-2 py-1.5 text-[12px]" />
          </InspectorField>
          <InspectorField label="Assignee role">
            <select value={String(c.assigneeRole ?? "CUSTOMS_BROKER")}
              onChange={(e) => patchConfig({ assigneeRole: e.target.value })}
              className="rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-2 py-1.5 text-[12px]">
              {["CUSTOMS_BROKER","SENIOR_BROKER","CLEARANCE_AGENT","DOCUMENTATION_SPECIALIST","FINANCE_OFFICER","COMPLIANCE_REVIEWER"].map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </InspectorField>
        </>
      )}

      {node.type === "logic.value_threshold" && (
        <InspectorField label="Threshold (MYR)">
          <input type="number" min={0} value={Number(c.thresholdMYR ?? 250000)}
            onChange={(e) => patchConfig({ thresholdMYR: Number(e.target.value) })}
            className="rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-2 py-1.5 text-[12px]" />
        </InspectorField>
      )}

      {node.type === "action.request_approval" && (
        <>
          <InspectorField label="Approver role">
            <select value={String(c.role ?? "CUSTOMS_BROKER")}
              onChange={(e) => patchConfig({ role: e.target.value })}
              className="rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-2 py-1.5 text-[12px]">
              {["CUSTOMS_BROKER","SENIOR_BROKER","BROKERAGE_MANAGER","COMPLIANCE_REVIEWER","FINANCE_OFFICER","ADMIN"].map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </InspectorField>
          <InspectorField label="Escalation role (over threshold)">
            <select value={String(c.thresholdRole ?? "SENIOR_BROKER")}
              onChange={(e) => patchConfig({ thresholdRole: e.target.value })}
              className="rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-2 py-1.5 text-[12px]">
              {["SENIOR_BROKER","BROKERAGE_MANAGER","COMPLIANCE_REVIEWER","ADMIN"].map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </InspectorField>
        </>
      )}

      {node.type === "action.prepare_declaration" && (
        <InspectorField label="Form code">
          <select value={String(c.formCode ?? "K1")}
            onChange={(e) => patchConfig({ formCode: e.target.value })}
            className="rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-2 py-1.5 font-mono text-[11px]">
            {["K1","K2","K3","K7","K8","K9"].map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </InspectorField>
      )}

      {node.type === "action.update_shipment_status" && (
        <InspectorField label="To status">
          <select value={String(c.toStatus ?? "declaration_draft")}
            onChange={(e) => patchConfig({ toStatus: e.target.value })}
            className="rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-2 py-1.5 font-mono text-[11px]">
            {["documents_pending","declaration_draft","broker_review","submitted","customs_query","inspection","released","delivered","cancelled"].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </InspectorField>
      )}

      {node.type === "logic.wait_for_event" && (
        <>
          <InspectorField label="Event kinds (comma-separated)"
            hint="jkdm.response, approval.decided, document.uploaded">
            <input type="text"
              value={Array.isArray(c.eventKinds) ? (c.eventKinds as string[]).join(", ") : ""}
              onChange={(e) => patchConfig({ eventKinds: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
              className="rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-2 py-1.5 font-mono text-[11px]" />
          </InspectorField>
          <InspectorField label="Timeout (hours)">
            <input type="number" min={1} value={Number(c.timeoutHours ?? 168)}
              onChange={(e) => patchConfig({ timeoutHours: Number(e.target.value) })}
              className="rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-2 py-1.5 text-[12px]" />
          </InspectorField>
        </>
      )}

      {node.type === "trigger.deadline.scheduled" && (
        <InspectorField label="Cron expression">
          <input type="text" value={String(c.cron ?? "0 9 * * *")}
            onChange={(e) => patchConfig({ cron: e.target.value })}
            className="rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-2 py-1.5 font-mono text-[11px]" />
        </InspectorField>
      )}

      {node.type === "output" && (
        <InspectorField label="Value (expression)" hint="e.g. nodes.t5.output">
          <input type="text" value={String(c.value ?? "")}
            onChange={(e) => patchConfig({ value: e.target.value })}
            className="rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-2 py-1.5 font-mono text-[11px]" />
        </InspectorField>
      )}

      {/* Generic JSON config for nodes without a tailored form */}
      {!["action.create_task","logic.value_threshold","action.request_approval","action.prepare_declaration","action.update_shipment_status","logic.wait_for_event","trigger.deadline.scheduled","output"].includes(node.type) && (
        <InspectorField label="Config (JSON)">
          <textarea rows={5} value={JSON.stringify(node.config ?? {}, null, 2)}
            onChange={(e) => { try { onChange({ config: JSON.parse(e.target.value || "{}") }); } catch { /* keep */ } }}
            className="rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-2 py-1.5 font-mono text-[11px]" />
        </InspectorField>
      )}

      {entry?.requiresCapability && (
        <div className="rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-2.5 py-1.5 font-mono text-[9.5px] text-[var(--text-muted)]">
          requires JKDM capability: <span className="text-[var(--text-secondary)]">{entry.requiresCapability}</span>
        </div>
      )}
    </InspectorShell>
  );
}
