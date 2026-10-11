"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Background, BackgroundVariant, Controls, MiniMap, ReactFlow, ReactFlowProvider,
  useEdgesState, useNodesState, useReactFlow, type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { brokerageNodeTypes } from "./nodes";
import {
  buildBrokerageWorkflowGraph, SAMPLE_ACCREDITATION, SAMPLE_CLIENT, SAMPLE_DECLARATION,
} from "./brokerageWorkflowGraph";
import { runBrokerageSimulation, type BrokerageSimulationHandle, type SimulationLogEntry } from "./brokerageSimulation";
import { RegulatoryHealthPanel } from "./RegulatoryHealthPanel";
import type {
  BrokerageEdge, BrokerageNode, BrokerageWorkflowExplorerProps, Declaration, RegulatoryGateResult,
} from "../types";
import { evaluateRegulatoryGate } from "../regulatory";
import { DEFAULT_RULE_SET } from "../regulatory/ruleSet";
import { JKDM_CONTROL_CATALOG } from "../regulatory/controlCatalog";
import { ACCREDITATION_STATUS_META } from "../constants";

type Layer = "all" | "operations" | "regulatory" | "authorization" | "engagement";

const LAYER_LABEL: Record<Layer, string> = {
  all: "All layers", operations: "Operations", regulatory: "Regulatory",
  authorization: "Authorization", engagement: "Engagement",
};

function Inner({
  nodes: nodesProp, edges: edgesProp,
  layerFilter: layerFilterProp = "all",
  selectedNodeId: selectedNodeIdProp,
  onSelectNode, onNodeOpen, height = 760, className, enableSimulation = true,
  ruleSetVersion = DEFAULT_RULE_SET.version,
}: BrokerageWorkflowExplorerProps) {
  const accreditation = SAMPLE_ACCREDITATION;

  const [layer, setLayer] = useState<Layer>(layerFilterProp as Layer);
  useEffect(() => setLayer(layerFilterProp as Layer), [layerFilterProp]);

  // Build a minimal sample declaration so the engine can run.
  const sampleDeclaration: Declaration = useMemo(() => ({
    id: "decl-k1-00418",
    reference: "K1/PG/2026/00418",
    clientId: "cl-meridian",
    clientName: "Meridian Electronics Sdn Bhd",
    formCode: "K1", type: "import", status: "classifying", channel: "UNASSIGNED",
    jurisdiction: "MY", port: "PG",
    documents: { invoiceRef: "INV-001", blRef: "BL-001" },
    lineItems: [],
    totalDeclaredValue: 486_300, currency: "MYR",
    totalDuty: 41_280, totalSalesTax: 0, totalExcise: 0,
    owningBroker: "Aisha Rahman", draftedBy: "agent.customs.declaration",
    draftConfidence: 0.94, approvals: [], eventIds: [],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    flags: [],
  }), []);

  const sampleClient = useMemo(() => ({
    id: "cl-meridian", name: "Meridian Electronics Sdn Bhd",
    registrationNumber: "201801004821-K", country: "MY",
    tier: "enterprise" as const, status: "active" as const, sla: "critical" as const,
    assignedBrokers: ["Aisha Rahman"], contactEmail: "trade@meridian.example",
    monthlyVolume: 412, registeredState: "Penang",
    authorization: { written: true, reference: "AUTH-2025-08-14", signedAt: "2025-08-14" },
  }), []);

  const gateResult: RegulatoryGateResult = useMemo(() =>
    evaluateRegulatoryGate(JKDM_CONTROL_CATALOG, {
      declaration: sampleDeclaration,
      client: sampleClient,
      accreditation,
      actor: "system",
      ruleSetVersion,
      channel: sampleDeclaration.channel,
    }),
  [sampleDeclaration, sampleClient, accreditation, ruleSetVersion]);

  const initial = useMemo(
    () => buildBrokerageWorkflowGraph({
      accreditation, client: SAMPLE_CLIENT, declaration: SAMPLE_DECLARATION,
      includeAgents: true, includeCompliance: true, includeInspection: true,
      catalog: JKDM_CONTROL_CATALOG,
    }),
    [accreditation]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState<BrokerageNode>(nodesProp ?? initial.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<BrokerageEdge>(edgesProp ?? initial.edges);

  useEffect(() => {
    if (nodesProp && edgesProp) return;
    const g = buildBrokerageWorkflowGraph({
      accreditation, client: SAMPLE_CLIENT, declaration: SAMPLE_DECLARATION,
      catalog: JKDM_CONTROL_CATALOG,
    });
    setNodes(g.nodes); setEdges(g.edges);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accreditation]);

  const [internalSelected, setInternalSelected] = useState<string | null>(null);
  const selectedNodeId = selectedNodeIdProp !== undefined ? selectedNodeIdProp : internalSelected;
  const selectNode = useCallback((id: string | null) => {
    if (selectedNodeIdProp === undefined) setInternalSelected(id);
    onSelectNode?.(id);
  }, [selectedNodeIdProp, onSelectNode]);

  const { fitView } = useReactFlow();

  const [isRunning, setIsRunning] = useState(false);
  const [log, setLog] = useState<SimulationLogEntry[]>([]);
  const simRef = useRef<BrokerageSimulationHandle | null>(null);

  const resetNodes = useCallback(() => {
    setNodes((ns) => ns.map((n) =>
      n.type === "lane" ? n : ({ ...n, data: { ...n.data, nodeStatus: "pending" } } as BrokerageNode)
    ));
  }, [setNodes]);

  const handleRun = useCallback(() => {
    if (isRunning) return;
    if (!gateResult.allowedToProceed) {
      setLog([{ ts: 0, tag: "err", message: `Regulatory gate blocked — ${gateResult.blockingControlIds.length} control(s)` }]);
      return;
    }
    setIsRunning(true); setLog([]);
    simRef.current = runBrokerageSimulation(nodes, edges, {
      cancel: () => {},
      onUpdate: (u) => setNodes(u),
      onLog: (e) => setLog((l) => [...l, e]),
      onDone: () => { setIsRunning(false); setTimeout(resetNodes, 1400); },
    }, { stepDelayMs: 420 });
  }, [isRunning, nodes, edges, setNodes, gateResult, resetNodes]);

  const handleCancel = useCallback(() => {
    simRef.current?.cancel(); simRef.current = null;
    setIsRunning(false); resetNodes();
  }, [resetNodes]);

  useEffect(() => () => simRef.current?.cancel(), []);
  useEffect(() => {
    const t = setTimeout(() => fitView({ padding: 0.15, duration: 400, maxZoom: 0.9 }), 100);
    return () => clearTimeout(t);
  }, [layer, fitView]);

  const visibleNodes = useMemo(() => {
    if (layer === "all") return nodes;
    return nodes.filter((n) => {
      if (n.type === "lane") return n.data.layer === layer;
      if (n.type === "accreditation") return layer === "regulatory";
      if (n.type === "client") return layer === "engagement";
      if (n.id === "gate-client-authorization" || n.id === "rule-agent-limit") return layer === "engagement";
      if (n.type === "human-gate" || n.type === "compliance") return layer === "authorization";
      return layer === "operations";
    });
  }, [nodes, layer]);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) ?? null;
  const statusMeta = ACCREDITATION_STATUS_META[accreditation.status];

  return (
    <section className={["relative flex flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg)]", className ?? ""].join(" ")}
             style={{ height }} aria-label="Brokerage workflow explorer">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] bg-[var(--bg-elev)] px-4 py-2.5">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)]">Brokerage workflow</span>
          <span className="rounded bg-[var(--bg-subtle)] px-2 py-0.5 font-mono text-[10.5px] text-[var(--text-muted)]">
            {nodes.filter((n) => n.type !== "lane").length} nodes · {edges.length} edges
          </span>
          <span className="flex items-center gap-1.5 rounded px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider"
                style={{ background: statusMeta.bg, color: statusMeta.color }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: statusMeta.color }} />
            §90 {statusMeta.label}
          </span>
          <span className={["rounded px-2 py-0.5 font-mono text-[10.5px]",
            gateResult.allowedToProceed ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"].join(" ")}>
            gate {gateResult.allowedToProceed ? "✓" : `✕ ${gateResult.blockingControlIds.length}`}
          </span>
          <span className="font-mono text-[10px] text-[var(--text-muted)]">rule set {ruleSetVersion}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div role="tablist" aria-label="Layer filter"
               className="flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] p-0.5">
            {(["all", "operations", "regulatory", "authorization", "engagement"] as const).map((l) => (
              <button key={l} role="tab" aria-selected={layer === l} onClick={() => setLayer(l)}
                className={["rounded-md px-2.5 py-1 font-mono text-[10.5px] font-medium transition-colors",
                  layer === l ? "bg-[var(--bg-elev)] text-[var(--text)] shadow-sm" : "text-[var(--text-muted)] hover:text-[var(--text)]"].join(" ")}>
                {LAYER_LABEL[l]}
              </button>
            ))}
          </div>

          {enableSimulation && (
            isRunning ? (
              <button type="button" onClick={handleCancel}
                className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-1 font-mono text-[11px] font-medium text-red-400 transition-colors hover:bg-red-500/20">
                ■ Cancel
              </button>
            ) : (
              <button type="button" onClick={handleRun}
                disabled={!gateResult.allowedToProceed}
                title={!gateResult.allowedToProceed ? "Regulatory gate blocked" : "Run simulation (preview only)"}
                className="rounded-md bg-emerald-500 px-3 py-1 font-mono text-[11px] font-medium text-emerald-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40">
                ▶ Simulate
              </button>
            )
          )}

          <button type="button" onClick={() => fitView({ padding: 0.15, duration: 400 })}
            className="rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-2.5 py-1 font-mono text-[11px] text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-muted)] hover:text-[var(--text)]"
            aria-label="Fit view">⤢</button>
        </div>
      </header>

      <div className="relative grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[1fr_380px]">
        <div className="relative min-h-0">
          <ReactFlow nodes={visibleNodes} edges={edges}
            onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
            nodeTypes={brokerageNodeTypes}
            onNodeClick={(_, node) => selectNode(node.id)}
            onNodeDoubleClick={(_, node) => {
              const found = nodes.find((n) => n.id === node.id);
              if (found) onNodeOpen?.(found);
            }}
            onPaneClick={() => selectNode(null)}
            fitView minZoom={0.1} maxZoom={1.8}
            nodesDraggable nodesConnectable={false} edgesFocusable={false}
            proOptions={{ hideAttribution: false }}>
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#26262b" />
            <Controls showInteractive={false} position="bottom-left" />
            <MiniMap nodeStrokeWidth={3}
              nodeColor={(n: Node) => {
                switch (n.type) {
                  case "accreditation": return "#ef4444";
                  case "client": return "#3b82f6";
                  case "declaration": return "#8b5cf6";
                  case "agent": return "#10b981";
                  case "human-gate": return "#f59e0b";
                  case "compliance": return "#f472b6";
                  default: return "#71717a";
                }
              }}
              maskColor="rgba(10,10,11,0.75)" position="bottom-right" pannable zoomable />
          </ReactFlow>
        </div>

        <aside className="flex min-h-0 flex-col border-l border-[var(--border)] bg-[var(--bg-elev)]">
          <div className="flex-1 overflow-y-auto p-4">
            {(layer === "regulatory" || (!selectedNode && layer === "all")) && (
              <RegulatoryHealthPanel
                gateResult={gateResult}
                licenceNumber={accreditation.licenceNumber}
                ejenType={accreditation.ejenType}
                expiresAt={accreditation.expiresAt}
                className="mb-4"
                onControlClick={(controlId) => {
                  setLayer("regulatory");
                  selectNode(`accred-${controlId}`);
                }} />
            )}

            <div className="mb-3 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              {selectedNode ? "Detail" : "Select a node"}
            </div>

            {!selectedNode && (
              <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[var(--border)] bg-[var(--bg-subtle)] px-4 py-10 text-center">
                <div className="font-mono text-lg text-[var(--text-muted)] opacity-40">◇</div>
                <div className="font-mono text-[11.5px] leading-relaxed text-[var(--text-muted)]">
                  Click any node to inspect.<br />Regulatory nodes carry a § reference and control ID.
                </div>
              </div>
            )}

            {selectedNode && <NodeDetail node={selectedNode} nodes={nodes} edges={edges} />}
          </div>

          <div className="border-t border-[var(--border-subtle)] bg-[var(--bg)]">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Log · {log.length} · simulation
              </span>
              {log.length > 0 && (
                <button onClick={() => setLog([])} className="font-mono text-[10px] text-[var(--text-muted)] hover:text-[var(--text)]">clear</button>
              )}
            </div>
            <div className="max-h-[200px] overflow-y-auto p-3">
              {log.length === 0 ? (
                <div className="py-4 text-center font-mono text-[10.5px] text-[var(--text-muted)]">
                  no runs yet — simulation previews only
                </div>
              ) : (
                <ul className="flex flex-col gap-1">
                  {log.map((l, i) => (
                    <li key={i} className="grid grid-cols-[60px_56px_1fr] items-baseline gap-2 font-mono text-[10.5px] leading-snug">
                      <span className="text-[var(--text-muted)]">[{(l.ts / 1000).toFixed(2)}s]</span>
                      <span className={["rounded px-1 py-0.5 text-center text-[9px] font-semibold uppercase tracking-wider",
                        l.tag === "human" ? "bg-amber-500/15 text-amber-400"
                        : l.tag === "ok" ? "bg-emerald-500/15 text-emerald-400"
                        : l.tag === "err" ? "bg-red-500/15 text-red-400"
                        : l.tag === "warn" ? "bg-amber-500/15 text-amber-400"
                        : l.tag === "compliance" ? "bg-purple-500/15 text-purple-300"
                        : "bg-blue-500/15 text-blue-300"].join(" ")}>
                        {l.tag}
                      </span>
                      <span className="text-[var(--text-secondary)]">{l.message}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function NodeDetail({ node, nodes, edges }: { node: BrokerageNode; nodes: BrokerageNode[]; edges: BrokerageEdge[] }) {
  const preds = edges.filter((e) => e.target === node.id).map((e) => e.source);
  const succs = edges.filter((e) => e.source === node.id).map((e) => e.target);

  return (
    <div className="flex flex-col gap-4">
      {node.type === "accreditation" && (
        <>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-red-400">
              Regulatory · {node.data.section}{node.data.ruleVersion !== undefined ? ` · v${node.data.ruleVersion}` : ""}
            </span>
            <h3 className="mt-1 text-[14px] font-semibold text-[var(--text)]">{node.data.label}</h3>
            <div className="mt-1 text-[11px] text-[var(--text-secondary)]">{node.data.summary}</div>
          </div>
          {node.data.controlId && (
            <Field label="Control ID"><span className="font-mono">{node.data.controlId}</span></Field>
          )}
          {node.data.state && <Field label="Current state">{node.data.state}</Field>}
          {node.data.deadlineDays !== undefined && (
            <Field label="Deadline">
              {node.data.deadlineDays < 0 ? `${Math.abs(node.data.deadlineDays)} days overdue` : `${node.data.deadlineDays} days remaining`}
            </Field>
          )}
          {node.data.references && node.data.references.length > 0 && (
            <Field label="References">
              <ul className="flex flex-col gap-1">
                {node.data.references.map((r) => (
                  <li key={r.id} className="font-mono text-[10.5px]">
                    <span className="text-[var(--text-secondary)]">{r.title}{r.section ? ` ${r.section}` : ""}</span>
                    {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" className="ml-2 text-emerald-400 hover:underline">↗</a>}
                    {r.verificationStatus !== "VERIFIED" && (
                      <span className="ml-2 text-amber-400">{r.verificationStatus}</span>
                    )}
                  </li>
                ))}
              </ul>
            </Field>
          )}
          {node.data.consequence && <Field label="If violated"><span className="text-red-400">{node.data.consequence}</span></Field>}
        </>
      )}

      {node.type === "client" && (
        <>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-blue-400">Client</span>
            <h3 className="mt-1 text-[14px] font-semibold text-[var(--text)]">{node.data.name}</h3>
          </div>
          <Field label="Tier">{node.data.tier}</Field>
          <Field label="SLA">{node.data.sla}</Field>
          <Field label="Written authorization (§90(1)(b))">
            {node.data.authorized
              ? <span className="text-emerald-400">✓ on file {node.data.authorizedAt ? `· ${new Date(node.data.authorizedAt).toLocaleDateString()}` : ""}</span>
              : <span className="text-red-400">✕ not on file</span>}
          </Field>
        </>
      )}

      {node.type === "declaration" && (
        <>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-purple-400">
              {node.data.formCode} · {node.data.type}
            </span>
            <h3 className="mt-1 text-[14px] font-semibold text-[var(--text)]">{node.data.reference}</h3>
          </div>
          <Field label="Channel">{node.data.channel}</Field>
          <Field label="Status">{node.data.status}</Field>
          <Field label="Owning broker">{node.data.owningBroker}</Field>
          {node.data.gateOutcome && (
            <Field label="Gate">
              <span className={node.data.gateOutcome.allowed ? "text-emerald-400" : "text-red-400"}>
                {node.data.gateOutcome.allowed ? "✓ allowed" : `✕ ${node.data.gateOutcome.blockingCount} blocking`}
              </span>
              <span className="block font-mono text-[10px] text-[var(--text-muted)]">rule set {node.data.gateOutcome.ruleSetVersion}</span>
            </Field>
          )}
        </>
      )}

      {node.type === "human-gate" && (
        <>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-amber-400">
              HITL gate{node.data.regulation ? ` · ${node.data.regulation}` : ""}
            </span>
            <h3 className="mt-1 text-[14px] font-semibold text-[var(--text)]">{node.data.label}</h3>
          </div>
          {node.data.description && <Field label="Description">{node.data.description}</Field>}
          <Field label="Required role">{node.data.requiredRole}</Field>
        </>
      )}

      {node.type === "compliance" && (
        <>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-red-400">
              Compliance · {node.data.category} · {node.data.action}
            </span>
            <h3 className="mt-1 text-[14px] font-semibold text-[var(--text)]">{node.data.label}</h3>
          </div>
          {node.data.legalRef && <Field label="Legal ref">{node.data.legalRef}</Field>}
          <Field label="Description">{node.data.description}</Field>
        </>
      )}

      {node.type === "agent" && (
        <>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">Agent · {node.data.role}</span>
            <h3 className="mt-1 text-[14px] font-semibold text-[var(--text)]">{node.data.name}</h3>
            <div className="font-mono text-[10.5px] text-[var(--text-muted)]">{node.data.agentId}</div>
          </div>
        </>
      )}

      {node.type === "lane" && (
        <>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Lane · {node.data.layer}{node.data.phase ? ` · ${node.data.phase}` : ""}
            </span>
            <h3 className="mt-1 text-[14px] font-semibold text-[var(--text)]">{node.data.label}</h3>
          </div>
          {node.data.description && <Field label="Description">{node.data.description}</Field>}
        </>
      )}

      <div className="mt-2 grid grid-cols-2 gap-3 border-t border-[var(--border-subtle)] pt-3">
        <Field label="Predecessors">
          <ul className="flex flex-col gap-0.5">
            {preds.length === 0 ? <li className="font-mono text-[10.5px] text-[var(--text-muted)]">—</li>
              : preds.map((id) => <li key={id} className="truncate font-mono text-[10.5px] text-[var(--text-secondary)]">← {labelFor(id, nodes)}</li>)}
          </ul>
        </Field>
        <Field label="Successors">
          <ul className="flex flex-col gap-0.5">
            {succs.length === 0 ? <li className="font-mono text-[10.5px] text-[var(--text-muted)]">—</li>
              : succs.map((id) => <li key={id} className="truncate font-mono text-[10.5px] text-[var(--text-secondary)]">→ {labelFor(id, nodes)}</li>)}
          </ul>
        </Field>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[9.5px] uppercase tracking-wider text-[var(--text-muted)]">{label}</span>
      <div className="text-[11.5px] text-[var(--text-secondary)]">{children}</div>
    </div>
  );
}

function labelFor(id: string, nodes: BrokerageNode[]): string {
  const n = nodes.find((x) => x.id === id);
  if (!n) return id;
  if (n.type === "client") return n.data.name;
  if (n.type === "declaration") return n.data.reference;
  if (n.type === "agent") return n.data.name;
  if (n.type === "human-gate") return n.data.label;
  if (n.type === "compliance") return n.data.label;
  if (n.type === "accreditation") return `${n.data.section} ${n.data.label}`;
  if (n.type === "lane") return n.data.label;
  return id;
}

export function BrokerageWorkflowExplorer(props: BrokerageWorkflowExplorerProps) {
  return <ReactFlowProvider><Inner {...props} /></ReactFlowProvider>;
}

export default BrokerageWorkflowExplorer;
