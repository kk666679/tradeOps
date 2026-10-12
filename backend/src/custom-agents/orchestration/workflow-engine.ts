type WorkflowNode = { id: string; type: string; position: { x: number; y: number }; data: { label?: string; config?: Record<string, any> } };
type WorkflowEdge = { id: string; source: string; target: string; sourceHandle?: string; targetHandle?: string; label?: string };
type WorkflowDefinition = { nodes: WorkflowNode[]; edges: WorkflowEdge[] };

type Issue = { code: string; message: string; nodeId?: string; edgeId?: string };
type StepRecord = {
  nodeId: string; status: 'SUCCEEDED' | 'FAILED' | 'SKIPPED'; attempts: number;
  startedAt?: string; endedAt: string; input?: unknown; output?: unknown; error?: string;
  logs: { level: 'info' | 'error'; message: string }[];
};

const TYPES = new Set(['trigger.manual', 'data.transform', 'logic.condition', 'flow.output']);
const PORTS: Record<string, { inputs: string[]; outputs: string[] }> = {
  'trigger.manual': { inputs: [], outputs: ['out'] },
  'data.transform': { inputs: ['in'], outputs: ['out'] },
  'logic.condition': { inputs: ['in'], outputs: ['true', 'false'] },
  'flow.output': { inputs: ['in'], outputs: [] },
};

function safeValue(value: unknown): boolean {
  try { return JSON.stringify(value).length <= 100_000; } catch { return false; }
}

export function validateWorkflow(definition: WorkflowDefinition): Issue[] {
  const issues: Issue[] = [];
  const nodes = Array.isArray(definition?.nodes) ? definition.nodes : [];
  const edges = Array.isArray(definition?.edges) ? definition.edges : [];
  if (!nodes.length) return [{ code: 'empty_graph', message: 'Add a trigger and at least one step.' }];
  if (nodes.length > 50 || edges.length > 100) issues.push({ code: 'graph_limit', message: 'A workflow can contain at most 50 nodes and 100 connections.' });
  const byId = new Map<string, WorkflowNode>();
  for (const node of nodes) {
    if (!node?.id || byId.has(node.id)) issues.push({ code: 'duplicate_node', message: 'Node IDs must be present and unique.', nodeId: node?.id });
    else byId.set(node.id, node);
    if (!TYPES.has(node?.type)) issues.push({ code: 'unsupported_node', message: `Node type “${node?.type ?? 'unknown'}” has no execution handler.`, nodeId: node?.id });
    if (!Number.isFinite(node?.position?.x) || !Number.isFinite(node?.position?.y)) issues.push({ code: 'invalid_position', message: 'Node position must be finite.', nodeId: node?.id });
    if (node?.type === 'logic.condition' && (!node.data?.config?.path || !['equals', 'notEquals', 'contains', 'greaterThan', 'isTruthy'].includes(String(node.data.config.operator)))) {
      issues.push({ code: 'invalid_condition', message: 'Set a condition path and supported operator.', nodeId: node.id });
    }
    if (node?.type === 'data.transform' && (!node.data?.config?.mapping || typeof node.data.config.mapping !== 'object' || Array.isArray(node.data.config.mapping))) {
      issues.push({ code: 'invalid_transform', message: 'Add at least one key to the transform mapping.', nodeId: node.id });
    }
    const timeout = node?.data?.config?.timeoutMs;
    if (timeout !== undefined && (!Number.isInteger(timeout) || Number(timeout) < 100 || Number(timeout) > 30_000)) {
      issues.push({ code: 'invalid_timeout', message: 'Timeout must be between 100 and 30,000 ms.', nodeId: node.id });
    }
  }
  const triggers = nodes.filter((node) => node.type === 'trigger.manual');
  if (triggers.length !== 1) issues.push({ code: 'trigger_count', message: 'A workflow must have exactly one manual trigger.' });
  if (!nodes.some((node) => node.type === 'flow.output')) issues.push({ code: 'output_required', message: 'Add an output node to finish the workflow.' });

  const edgeKeys = new Set<string>();
  const outgoing = new Map<string, string[]>();
  const incoming = new Map<string, string[]>();
  for (const node of nodes) { outgoing.set(node.id, []); incoming.set(node.id, []); }
  for (const edge of edges) {
    const source = byId.get(edge.source); const target = byId.get(edge.target);
    if (!source || !target) { issues.push({ code: 'missing_endpoint', message: 'Connection endpoint does not exist.', edgeId: edge.id }); continue; }
    if (edge.source === edge.target) issues.push({ code: 'self_connection', message: 'A node cannot connect to itself.', edgeId: edge.id });
    const key = `${edge.source}:${edge.sourceHandle ?? ''}>${edge.target}:${edge.targetHandle ?? ''}`;
    if (edgeKeys.has(key)) issues.push({ code: 'duplicate_edge', message: 'Duplicate connections are not allowed.', edgeId: edge.id });
    edgeKeys.add(key);
    const sourcePorts = PORTS[source.type]?.outputs ?? [];
    const targetPorts = PORTS[target.type]?.inputs ?? [];
    if (!sourcePorts.includes(edge.sourceHandle ?? 'out')) issues.push({ code: 'invalid_output_handle', message: 'Connection uses an invalid output handle.', edgeId: edge.id });
    if (!targetPorts.includes(edge.targetHandle ?? 'in')) issues.push({ code: 'invalid_input_handle', message: 'Connection uses an invalid input handle.', edgeId: edge.id });
    outgoing.get(edge.source)?.push(edge.target);
    incoming.get(edge.target)?.push(edge.source);
  }
  for (const node of nodes.filter((item) => item.type === 'logic.condition')) {
    const branches = edges.filter((edge) => edge.source === node.id).map((edge) => edge.sourceHandle ?? edge.label);
    if (!branches.includes('true') || !branches.includes('false')) issues.push({ code: 'missing_branch', message: 'Connect both the true and false condition outputs.', nodeId: node.id });
  }
  const colors = new Map<string, number>();
  const visit = (id: string) => {
    if (colors.get(id) === 1) return true;
    if (colors.get(id) === 2) return false;
    colors.set(id, 1);
    for (const next of outgoing.get(id) ?? []) if (visit(next)) return true;
    colors.set(id, 2); return false;
  };
  if (nodes.some((node) => visit(node.id))) issues.push({ code: 'cycle', message: 'Cycles are not supported by this execution engine.' });
  const root = triggers[0];
  if (root) {
    const reached = new Set<string>(); const stack = [root.id];
    while (stack.length) { const id = stack.pop()!; if (reached.has(id)) continue; reached.add(id); stack.push(...(outgoing.get(id) ?? [])); }
    for (const node of nodes) if (!reached.has(node.id)) issues.push({ code: 'unreachable_node', message: 'Node cannot be reached from the manual trigger.', nodeId: node.id });
  }
  return issues;
}

function resolvePath(path: string, context: Record<string, any>): unknown {
  if (!/^(trigger|nodes\.[A-Za-z0-9_-]+\.output|workflow\.variables)(\.[A-Za-z0-9_$-]+)*$/.test(path)) throw new Error(`Invalid expression path: ${path}`);
  return path.split('.').reduce((value: any, key) => value?.[key], context);
}

function resolveValue(value: unknown, context: Record<string, any>): unknown {
  if (typeof value !== 'string') return value;
  const exact = value.match(/^\{\{\s*([^{}]+?)\s*\}\}$/);
  if (exact) {
    const resolved = resolvePath(exact[1], context);
    if (resolved === undefined) throw new Error(`Expression “${exact[1]}” has no value.`);
    return resolved;
  }
  return value.replace(/\{\{\s*([^{}]+?)\s*\}\}/g, (_match, path: string) => {
    const resolved = resolvePath(path, context);
    if (resolved === undefined || resolved === null) throw new Error(`Expression “${path}” has no value.`);
    return typeof resolved === 'object' ? JSON.stringify(resolved) : String(resolved);
  });
}

function compare(left: any, operator: string, right: any): boolean {
  switch (operator) {
    case 'equals': return Object.is(left, right);
    case 'notEquals': return !Object.is(left, right);
    case 'contains': return Array.isArray(left) ? left.includes(right) : String(left ?? '').includes(String(right ?? ''));
    case 'greaterThan': return Number(left) > Number(right);
    case 'isTruthy': return Boolean(left);
    default: throw new Error('Unsupported condition operator.');
  }
}

export async function executeWorkflow(
  definition: WorkflowDefinition,
  triggerInput: Record<string, unknown>,
  identity: { executionId: string; workflowId: string; actorId: string },
) {
  const issues = validateWorkflow(definition);
  if (issues.length) throw new Error(`Workflow validation failed: ${issues.map((issue) => issue.message).join(' ')}`);
  if (!safeValue(triggerInput)) throw new Error('Trigger input is not safely serializable or exceeds 100 KB.');
  const nodes = new Map(definition.nodes.map((node) => [node.id, node]));
  const incoming = new Map<string, WorkflowEdge[]>(); const outgoing = new Map<string, WorkflowEdge[]>();
  for (const node of definition.nodes) { incoming.set(node.id, []); outgoing.set(node.id, []); }
  for (const edge of definition.edges) { incoming.get(edge.target)!.push(edge); outgoing.get(edge.source)!.push(edge); }
  const edgeStates = new Map(definition.edges.map((edge) => [edge.id, 'pending' as 'pending' | 'active' | 'inactive']));
  const trigger = definition.nodes.find((node) => node.type === 'trigger.manual')!;
  const nodeStates = new Map<string, 'pending' | 'done' | 'skipped'>();
  const outputs: Record<string, unknown> = {};
  const context: Record<string, any> = { trigger: triggerInput, nodes: {}, workflow: { variables: {} } };
  const steps: StepRecord[] = [];
  let finalOutput: unknown = null;
  const ready: string[] = [trigger.id];
  let processed = 0;

  while (ready.length) {
    const id = ready.shift()!; if (nodeStates.has(id)) continue;
    const node = nodes.get(id)!; const start = new Date();
    const activeInputs = (incoming.get(id) ?? []).filter((edge) => edgeStates.get(edge.id) === 'active');
    if (node.type !== 'trigger.manual' && !activeInputs.length) {
      nodeStates.set(id, 'skipped');
      const skipped = { nodeId: id, status: 'SKIPPED' as const, attempts: 0, endedAt: new Date().toISOString(), logs: [{ level: 'info' as const, message: 'Skipped because its incoming branch was not selected.' }] };
      steps.push(skipped);
      for (const edge of outgoing.get(id) ?? []) edgeStates.set(edge.id, 'inactive');
    } else {
      const upstream = activeInputs.map((edge) => outputs[edge.source]).filter((value) => value !== undefined);
      const input = node.type === 'trigger.manual' ? triggerInput : upstream.length <= 1 ? upstream[0] : upstream;
      let output: unknown;
      let chosenHandle: string | undefined;
      try {
        const config = node.data?.config ?? {};
        if (node.type === 'trigger.manual') output = triggerInput;
        else if (node.type === 'data.transform') {
          const mapping = config.mapping as Record<string, unknown>;
          output = Object.fromEntries(Object.entries(mapping).map(([key, value]) => [key, resolveValue(value, context)]));
        } else if (node.type === 'logic.condition') {
          const left = resolveValue(`{{${String(config.path)}}}`, context);
          const right = resolveValue(config.value, context);
          chosenHandle = compare(left, String(config.operator), right) ? 'true' : 'false';
          output = { result: chosenHandle === 'true', value: left };
        } else {
          output = input;
          finalOutput = input;
        }
        if (!safeValue(output)) throw new Error('Node output exceeds the 100 KB serialization limit.');
        outputs[id] = output; context.nodes[id] = { output };
        nodeStates.set(id, 'done');
        steps.push({ nodeId: id, status: 'SUCCEEDED', attempts: 1, startedAt: start.toISOString(), endedAt: new Date().toISOString(), input, output, logs: [{ level: 'info', message: `Completed ${node.data?.label || node.type}.` }] });
        for (const edge of outgoing.get(id) ?? []) {
          const branch = edge.sourceHandle ?? edge.label;
          edgeStates.set(edge.id, chosenHandle && branch !== chosenHandle ? 'inactive' : 'active');
        }
      } catch (error) {
        const failedSteps = [...steps, { nodeId: id, status: 'FAILED' as const, attempts: 1, startedAt: start.toISOString(), endedAt: new Date().toISOString(), input, error: error instanceof Error ? error.message : 'Node failed.', logs: [{ level: 'error' as const, message: error instanceof Error ? error.message : 'Node failed.' }] }];
        const failure = new Error(error instanceof Error ? error.message : 'Node failed.') as Error & { steps: StepRecord[] };
        failure.steps = failedSteps;
        throw failure;
      }
    }
    processed++;
    if (processed > definition.nodes.length) throw new Error('Execution stopped because the graph did not make progress.');
    for (const target of new Set((outgoing.get(id) ?? []).map((edge) => edge.target))) {
      if (nodeStates.has(target)) continue;
      const edges = incoming.get(target) ?? [];
      if (edges.every((edge) => edgeStates.get(edge.id) !== 'pending')) ready.push(target);
    }
  }
  for (const node of definition.nodes) if (!nodeStates.has(node.id)) throw new Error(`Execution could not schedule node ${node.id}.`);
  return { output: finalOutput, steps, execution: identity };
}
