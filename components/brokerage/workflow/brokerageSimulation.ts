// components/brokerage/workflow/brokerageSimulation.ts
import type { BrokerageEdge, BrokerageNode, BrokerageNodeStatus } from "../types";
import type {
  BrokerageSimulationHandle, BrokerageSimulationOptions,
  SimulationLogEntry, SimulationTag,
} from "./types";

export type {
  BrokerageSimulationHandle,
  BrokerageSimulationOptions,
  SimulationLogEntry,
  SimulationTag,
};

/**
 * Simulation is explicitly local. It evaluates the rule catalog and produces
 * a preview of control outcomes. It is NOT a JKDM customs response and never
 * assigns an actual channel or release decision.
 */

const ORDER = [
  "step-doc-upload", "step-doc-extract", "step-doc-reconcile",
  "gate-broker-signoff", "gate-senior-review", "gate-compliance-signoff",
  "step-ucustoms-submit", "step-channel-assign", "gate-jkdm-inspection",
];

const MESSAGES: Record<string, { tag: SimulationTag; message: string }> = {
  "step-doc-upload":           { tag: "agent",      message: "[SIMULATION] document intake" },
  "step-doc-extract":          { tag: "agent",      message: "[SIMULATION] OCR extraction" },
  "step-doc-reconcile":        { tag: "agent",      message: "[SIMULATION] reconcile" },
  "gate-broker-signoff":       { tag: "human",      message: "[SIMULATION] broker sign-off" },
  "gate-senior-review":        { tag: "human",      message: "[SIMULATION] senior review" },
  "gate-compliance-signoff":   { tag: "human",      message: "[SIMULATION] compliance sign-off" },
  "step-ucustoms-submit":      { tag: "agent",      message: "[SIMULATION] UCustoms submission preview — no EDI sent" },
  "step-channel-assign":       { tag: "agent",      message: "[SIMULATION] channel assignment preview — JKDM decides actual channel" },
  "gate-jkdm-inspection":      { tag: "human",      message: "[SIMULATION] inspection preview — no JKDM officer involved" },
};

export function runBrokerageSimulation(
  nodes: BrokerageNode[],
  _edges: BrokerageEdge[],
  handle: BrokerageSimulationHandle,
  options: BrokerageSimulationOptions = {}
): BrokerageSimulationHandle {
  const stepDelay = options.stepDelayMs ?? 420;
  const start = Date.now();
  let cancelled = false;
  let timer: ReturnType<typeof setTimeout> | null = null;

  handle.onLog({ ts: 0, tag: "warn", message: "Simulation mode — outcomes are previews, not JKDM decisions" });

  const present = new Set(nodes.map((n) => n.id));
  const plan = ORDER.filter((id) => present.has(id));
  let working = nodes.map((n) => ({ ...n }));

  const applyStatus = (id: string, status: BrokerageNodeStatus) => {
    working = working.map((n) =>
      n.id === id ? ({ ...n, data: { ...n.data, nodeStatus: status } } as BrokerageNode) : n
    );
    handle.onUpdate(working);
  };

  let i = 0;
  const tick = () => {
    if (cancelled) return;
    if (i >= plan.length) {
      handle.onLog({ ts: Date.now() - start, tag: "warn", message: "Simulation complete — no JKDM interaction occurred" });
      handle.onDone();
      return;
    }
    const id = plan[i];
    applyStatus(id, "active");
    const meta = MESSAGES[id];
    if (meta) handle.onLog({ ts: Date.now() - start, tag: meta.tag, message: meta.message });
    timer = setTimeout(() => {
      if (cancelled) return;
      applyStatus(id, "done");
      i++; tick();
    }, stepDelay);
  };

  timer = setTimeout(tick, 120);

  return {
    cancel: () => { cancelled = true; if (timer) clearTimeout(timer); handle.cancel?.(); },
    onUpdate: handle.onUpdate, onLog: handle.onLog, onDone: handle.onDone,
  };
}
