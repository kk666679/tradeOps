'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  addEdge, applyEdgeChanges, applyNodeChanges, Background, Controls, MiniMap,
  ReactFlow, ReactFlowProvider, reconnectEdge, useReactFlow,
  type Connection, type EdgeChange, type NodeChange,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import {
  ArrowLeft, Check, CircleAlert, Clock3, Copy, GitBranch, LoaderCircle,
  Play, Redo2, Save, Search, Trash2, Undo2, WandSparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { trpc } from '@/providers/TRPCProvider'
import { canConnect, validateWorkflow, type ValidationIssue } from '@/lib/workflow/validation'
import { WORKFLOW_NODE_CATALOG } from '@/lib/workflow/catalog'
import type { WorkflowDefinition, WorkflowEdge, WorkflowNode } from '@/lib/workflow/types'
import { WorkflowNodeCard } from './nodes/WorkflowNodeCard'

const nodeTypes = { workflow: WorkflowNodeCard }
const defaultDefinition: WorkflowDefinition = {
  schemaVersion: 1,
  trigger: { type: 'manual' },
  nodes: [
    { id: 'trigger', type: 'trigger.manual', position: { x: 80, y: 180 }, data: { label: 'Manual trigger', config: {} } },
    { id: 'transform', type: 'data.transform', position: { x: 360, y: 180 }, data: { label: 'Prepare record', config: { mapping: { reference: '{{trigger.reference}}', approved: '{{trigger.approved}}' } } } },
    { id: 'condition', type: 'logic.condition', position: { x: 660, y: 180 }, data: { label: 'Approved?', config: { path: 'trigger.approved', operator: 'equals', value: true } } },
    { id: 'output', type: 'flow.output', position: { x: 980, y: 180 }, data: { label: 'Return result', config: {} } },
  ],
  edges: [
    { id: 'e-trigger-transform', source: 'trigger', target: 'transform', sourceHandle: 'out', targetHandle: 'in' },
    { id: 'e-transform-condition', source: 'transform', target: 'condition', sourceHandle: 'out', targetHandle: 'in' },
    { id: 'e-condition-true', source: 'condition', target: 'output', sourceHandle: 'true', targetHandle: 'in', label: 'true' },
    { id: 'e-condition-false', source: 'condition', target: 'output', sourceHandle: 'false', targetHandle: 'in', label: 'false' },
  ],
}

type Snapshot = { nodes: WorkflowNode[]; edges: WorkflowEdge[] }
const iconFor: Record<string, React.ComponentType<{ className?: string }>> = { trigger: Play, flow: CircleAlert, logic: GitBranch, data: WandSparkles }

function makeNode(type: string, position: { x: number; y: number }): WorkflowNode {
  const definition = WORKFLOW_NODE_CATALOG.find((entry) => entry.type === type)!
  const config: Record<string, unknown> = type === 'data.transform'
    ? { mapping: { value: '{{trigger.value}}' } }
    : type === 'logic.condition'
      ? { path: 'trigger.value', operator: 'equals', value: true }
      : {}
  return { id: crypto.randomUUID(), type, position, data: { label: definition.label, config } }
}

function WorkflowStudioInner({ workflowId: initialWorkflowId }: { workflowId?: string }) {
  const rf = useReactFlow<WorkflowNode, WorkflowEdge>()
  const [workflowId, setWorkflowId] = React.useState(initialWorkflowId)
  const [name, setName] = React.useState('Untitled workflow')
  const [description, setDescription] = React.useState('')
  const [nodes, setNodes] = React.useState<WorkflowNode[]>(defaultDefinition.nodes)
  const [edges, setEdges] = React.useState<WorkflowEdge[]>(defaultDefinition.edges)
  const [viewport, setViewport] = React.useState({ x: 0, y: 0, zoom: 1 })
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [query, setQuery] = React.useState('')
  const [triggerInput, setTriggerInput] = React.useState('{\n  "reference": "PO-1042",\n  "approved": true\n}')
  const [mappingText, setMappingText] = React.useState('')
  const [runResult, setRunResult] = React.useState<any>(null)
  const [saveState, setSaveState] = React.useState<'saved' | 'unsaved' | 'saving' | 'error'>('unsaved')
  const [savedAt, setSavedAt] = React.useState<string | null>(null)
  const [past, setPast] = React.useState<Snapshot[]>([])
  const [future, setFuture] = React.useState<Snapshot[]>([])
  const dragSnapshot = React.useRef<Snapshot | null>(null)
  const selectedNode = nodes.find((node) => node.id === selectedId) ?? null

  const getQuery = trpc.customAgents.orchestration.getWorkflow.useQuery(
    { workflowId: workflowId ?? '' }, { enabled: Boolean(workflowId) },
  )
  const saveMutation = trpc.customAgents.orchestration.saveDraft.useMutation()
  const validateMutation = trpc.customAgents.orchestration.validate.useMutation()
  const executeMutation = trpc.customAgents.orchestration.execute.useMutation()
  const runsQuery = trpc.customAgents.orchestration.listRuns.useQuery(
    { workflowId: workflowId ?? '', take: 10 }, { enabled: Boolean(workflowId) },
  )
  const issues = React.useMemo(() => validateWorkflow({ ...defaultDefinition, nodes, edges }), [nodes, edges])

  React.useEffect(() => {
    if (!getQuery.data) return
    setName(getQuery.data.name)
    setDescription(getQuery.data.description)
    const loaded = getQuery.data.definition as WorkflowDefinition
    setNodes(loaded.nodes as WorkflowNode[])
    setEdges(loaded.edges as any)
    if (loaded.viewport) setViewport(loaded.viewport)
    setSavedAt(getQuery.data.updatedAt)
    setSaveState('saved')
  }, [getQuery.data])

  // React Flow's renderer uses a stable custom node name. Keep the executable
  // node type in node.data so the visual type does not rewrite the workflow DSL.
  const flowNodes = React.useMemo(() => nodes.map((node) => ({ ...node, type: 'workflow', data: { ...node.data, nodeType: node.type } })), [nodes])
  const onFlowNodesChange = React.useCallback((changes: NodeChange[]) => {
    setNodes((current) => {
      const currentFlowNodes = current.map((node) => ({ ...node, type: 'workflow', data: { ...node.data, nodeType: node.type } }))
      return applyNodeChanges(changes as any, currentFlowNodes as any).map((node: any) => ({ ...node, type: node.data.nodeType, data: (({ nodeType: _nodeType, ...data }) => data)(node.data) })) as WorkflowNode[]
    })
    if (changes.some((change) => change.type === 'position' || change.type === 'dimensions' || change.type === 'remove')) setSaveState('unsaved')
  }, [])
  const onFlowEdgesChange = React.useCallback((changes: EdgeChange[]) => {
    setEdges((current) => applyEdgeChanges(changes as any, current as any) as WorkflowEdge[])
    if (changes.some((change) => change.type === 'remove')) setSaveState('unsaved')
  }, [])

  const snapshot = React.useCallback(() => ({ nodes: structuredClone(nodes), edges: structuredClone(edges) }), [nodes, edges])
  const recordHistory = React.useCallback(() => { setPast((items) => [...items.slice(-49), snapshot()]); setFuture([]) }, [snapshot])
  const undo = () => {
    setPast((items) => {
      if (!items.length) return items
      const previous = items[items.length - 1]
      setFuture((next) => [snapshot(), ...next].slice(0, 50))
      setNodes(previous.nodes); setEdges(previous.edges); setSaveState('unsaved')
      return items.slice(0, -1)
    })
  }
  const redo = () => {
    setFuture((items) => {
      if (!items.length) return items
      const next = items[0]
      setPast((history) => [...history, snapshot()].slice(-50))
      setNodes(next.nodes); setEdges(next.edges); setSaveState('unsaved')
      return items.slice(1)
    })
  }

  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target?.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName ?? '')) return
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z') { event.preventDefault(); event.shiftKey ? redo() : undo() }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') { event.preventDefault(); void save() }
      if (event.key === 'Delete' || event.key === 'Backspace') {
        if (!selectedId) return
        recordHistory(); setNodes((current) => current.filter((node) => node.id !== selectedId)); setEdges((current) => current.filter((edge) => edge.source !== selectedId && edge.target !== selectedId)); setSelectedId(null); setSaveState('unsaved')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  async function save(): Promise<string | null> {
    setSaveState('saving')
    try {
      const graph: WorkflowDefinition = { schemaVersion: 1, trigger: { type: 'manual' }, nodes, edges, viewport }
      const result = await saveMutation.mutateAsync({ workflowId, expectedUpdatedAt: savedAt ?? undefined, name, description, definition: graph })
      setWorkflowId(result.id); setSavedAt(result.updatedAt); setSaveState('saved')
      if (!initialWorkflowId) window.history.replaceState({}, '', `/custom-agents/orchestration/canvas?workflowId=${encodeURIComponent(result.id)}`)
      return result.id
    } catch (error) { setSaveState('error') }
    return null
  }

  async function validateOnServer() {
    const graph: WorkflowDefinition = { schemaVersion: 1, trigger: { type: 'manual' }, nodes, edges, viewport }
    const result = await validateMutation.mutateAsync({ definition: graph })
    if (!result.issues.length) return 'Server validation passed.'
    return result.issues.map((issue: any) => issue.message).join('\n')
  }

  async function runWorkflow() {
    try {
      const input = JSON.parse(triggerInput)
      const id = workflowId ?? await save()
      if (!id) return
      const result = await executeMutation.mutateAsync({ workflowId: id, input })
      setRunResult(result); void runsQuery.refetch()
    } catch (error) {
      setRunResult({ status: 'FAILED', error: error instanceof Error ? error.message : 'Execution failed.', steps: [] })
    }
  }

  function addNode(type: string, position?: { x: number; y: number }) {
    recordHistory()
    const node = makeNode(type, position ?? { x: 220 + Math.random() * 100, y: 160 + Math.random() * 120 })
    setNodes((current) => [...current, node]); setSelectedId(node.id); setSaveState('unsaved')
  }

  const onConnect = (connection: Connection) => {
    if (!canConnect(connection, nodes, edges)) return
    recordHistory()
    const edge: WorkflowEdge = { ...connection, id: crypto.randomUUID(), source: connection.source!, target: connection.target!, sourceHandle: connection.sourceHandle ?? undefined, targetHandle: connection.targetHandle ?? undefined, ...(connection.sourceHandle === 'true' || connection.sourceHandle === 'false' ? { label: connection.sourceHandle } : {}) }
    setEdges((current) => addEdge(edge as any, current as any) as WorkflowEdge[]); setSaveState('unsaved')
  }

  function updateSelected(patch: Partial<WorkflowNode['data']>) {
    if (!selectedNode) return
    recordHistory()
    setNodes((current) => current.map((node) => node.id === selectedNode.id ? { ...node, data: { ...node.data, ...patch } } : node))
    setSaveState('unsaved')
  }

  function duplicateSelected() {
    if (!selectedNode) return
    recordHistory()
    const clone = { ...structuredClone(selectedNode), id: crypto.randomUUID(), position: { x: selectedNode.position.x + 50, y: selectedNode.position.y + 50 }, data: { ...structuredClone(selectedNode.data), label: `${selectedNode.data.label} copy` } }
    setNodes((current) => [...current, clone]); setSelectedId(clone.id); setSaveState('unsaved')
  }

  const filtered = WORKFLOW_NODE_CATALOG.filter((node) => `${node.label} ${node.description}`.toLowerCase().includes(query.toLowerCase()))
  const selectedStatus = runResult?.steps?.find((step: any) => step.nodeId === selectedId)?.status

  return (
    <div className="flex min-h-[calc(100vh-7rem)] flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-3">
        <div className="flex min-w-0 items-center gap-3">
          <Button asChild variant="ghost" size="icon" aria-label="Back to workflows"><Link href="/custom-agents/orchestration"><ArrowLeft className="h-4 w-4" /></Link></Button>
          <div className="min-w-0"><Input aria-label="Workflow name" value={name} onChange={(event) => { setName(event.target.value); setSaveState('unsaved') }} className="h-8 max-w-72 border-0 px-1 text-base font-semibold shadow-none" /><div className="flex items-center gap-1 px-1 text-xs text-muted-foreground">{saveState === 'saved' ? <Check className="h-3 w-3 text-emerald-600" /> : saveState === 'saving' ? <LoaderCircle className="h-3 w-3 animate-spin" /> : saveState === 'error' ? <CircleAlert className="h-3 w-3 text-destructive" /> : <span className="h-2 w-2 rounded-full bg-amber-500" />}{saveState === 'saved' ? `Saved${savedAt ? ` · ${new Date(savedAt).toLocaleTimeString()}` : ''}` : saveState === 'saving' ? 'Saving…' : saveState === 'error' ? 'Save failed' : 'Unsaved changes'}</div></div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2 py-1 text-xs ${issues.ok ? 'bg-emerald-500/10 text-emerald-700' : 'bg-destructive/10 text-destructive'}`}>{issues.ok ? 'Valid' : `${issues.errors.length} issue${issues.errors.length === 1 ? '' : 's'}`}</span>
          <Button variant="outline" size="sm" onClick={undo} disabled={!past.length} title="Undo (Ctrl+Z)"><Undo2 className="mr-1 h-4 w-4" />Undo</Button>
          <Button variant="outline" size="sm" onClick={redo} disabled={!future.length} title="Redo (Ctrl+Shift+Z)"><Redo2 className="mr-1 h-4 w-4" />Redo</Button>
          <Button variant="outline" size="sm" onClick={() => rf.fitView({ padding: 0.18 })}>Fit</Button>
          <Button variant="outline" size="sm" onClick={() => void validateOnServer()} disabled={validateMutation.isPending}>Validate</Button>
          <Button variant="outline" size="sm" onClick={() => void save()} disabled={saveMutation.isPending}><Save className="mr-1 h-4 w-4" />Save</Button>
          <Button size="sm" onClick={() => void runWorkflow()} disabled={executeMutation.isPending || !issues.ok}><Play className="mr-1 h-4 w-4" />{executeMutation.isPending ? 'Running…' : 'Test run'}</Button>
        </div>
      </div>
      {getQuery.error ? <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{getQuery.error.message}</div> : null}
      {saveMutation.error ? <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{saveMutation.error.message}</div> : null}
      <div className="grid min-h-[660px] flex-1 gap-3 xl:grid-cols-[220px_minmax(400px,1fr)_280px]">
        <Card className="flex min-h-0 flex-col overflow-hidden">
          <div className="border-b p-3"><h2 className="text-sm font-semibold">Node library</h2><div className="relative mt-2"><Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" /><Input aria-label="Search nodes" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search nodes" className="pl-8" /></div></div>
          <div className="flex-1 space-y-4 overflow-auto p-3">{filtered.map((item) => { const Icon = iconFor[item.category] ?? CircleAlert; return <button key={item.type} draggable onDragStart={(event) => { event.dataTransfer.setData('application/workflow-node', item.type); event.dataTransfer.effectAllowed = 'move' }} onClick={() => addNode(item.type)} className="flex w-full items-start gap-2 rounded-lg border p-2 text-left transition hover:border-primary/50 hover:bg-muted/50"><span className="mt-0.5 rounded-md bg-muted p-1.5"><Icon className="h-4 w-4" /></span><span><span className="block text-sm font-medium">{item.label}</span><span className="mt-0.5 block text-xs text-muted-foreground">{item.description}</span></span></button> })}</div>
          <div className="border-t p-3"><label className="text-xs font-medium" htmlFor="workflow-description">Description</label><Textarea id="workflow-description" value={description} onChange={(event) => { setDescription(event.target.value); setSaveState('unsaved') }} rows={3} className="mt-1 text-xs" placeholder="What does this workflow do?" /></div>
        </Card>

        <div className="flex min-h-[660px] flex-col overflow-hidden rounded-xl border bg-background">
          <div className="flex items-center justify-between border-b px-3 py-2"><div><h2 className="text-sm font-semibold">Canvas</h2><p className="text-xs text-muted-foreground">Drag nodes from the library, then connect the handles.</p></div><div className="text-xs text-muted-foreground">{nodes.length} nodes · {edges.length} connections</div></div>
          <div className="min-h-[500px] flex-1" onDrop={(event) => { event.preventDefault(); const type = event.dataTransfer.getData('application/workflow-node'); if (type) addNode(type, rf.screenToFlowPosition({ x: event.clientX, y: event.clientY })) }} onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = 'move' }}>
            <ReactFlow<WorkflowNode, WorkflowEdge> nodes={flowNodes as any} edges={edges as any} nodeTypes={nodeTypes} onNodesChange={onFlowNodesChange} onEdgesChange={onFlowEdgesChange} onConnect={onConnect} isValidConnection={(connection) => canConnect(connection, nodes, edges)} onNodeClick={(_event, node) => setSelectedId(node.id)} onPaneClick={() => setSelectedId(null)} onNodeDragStart={() => { dragSnapshot.current = snapshot() }} onNodeDragStop={() => { if (dragSnapshot.current) { setPast((items) => [...items.slice(-49), dragSnapshot.current!]); setFuture([]); dragSnapshot.current = null; setSaveState('unsaved') } }} onMoveEnd={(_event, nextViewport) => setViewport(nextViewport)} onReconnect={(oldEdge, connection) => { recordHistory(); setEdges((current) => reconnectEdge(oldEdge as any, connection, current as any) as WorkflowEdge[]); setSaveState('unsaved') }} fitView defaultEdgeOptions={{ type: 'smoothstep', animated: false }} deleteKeyCode={['Backspace', 'Delete']} selectionOnDrag multiSelectionKeyCode="Shift" panOnDrag={[1, 2]}>
              <Background gap={20} size={1} />
              <Controls position="bottom-left" />
              <MiniMap position="bottom-right" pannable zoomable nodeColor={(node) => node.type === 'trigger.manual' ? '#10b981' : node.type === 'logic.condition' ? '#f59e0b' : '#64748b'} />
            </ReactFlow>
          </div>
          <div className="grid gap-3 border-t p-3 lg:grid-cols-[1fr_1fr]">
            <div><Label htmlFor="trigger-input">Manual trigger input (JSON)</Label><Textarea id="trigger-input" value={triggerInput} onChange={(event) => setTriggerInput(event.target.value)} rows={4} className="mt-1 font-mono text-xs" /></div>
            <div><div className="flex items-center justify-between"><Label>Validation</Label><span className="text-xs text-muted-foreground">{issues.ok ? 'Ready to execute' : 'Fix blocking issues'}</span></div><div className="mt-1 max-h-24 space-y-1 overflow-auto">{issues.all.length ? issues.all.map((issue, index) => <button key={`${issue.code}-${index}`} onClick={() => { if (issue.nodeId) { setSelectedId(issue.nodeId); rf.setNodes((current) => current.map((node) => ({ ...node, selected: node.id === issue.nodeId }))) } }} className={`block w-full rounded px-2 py-1 text-left text-xs ${issue.severity === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'}`}>{issue.message}</button>) : <p className="rounded bg-emerald-500/10 px-2 py-1 text-xs text-emerald-700">No validation issues.</p>}</div></div>
          </div>
        </div>

        <Card className="flex min-h-0 flex-col overflow-hidden">
          <div className="border-b p-3"><h2 className="text-sm font-semibold">Inspector</h2><p className="text-xs text-muted-foreground">{selectedNode ? selectedNode.data.label : 'Workflow settings'}</p></div>
          <div className="flex-1 space-y-4 overflow-auto p-3">
            {selectedNode ? <>
              <div className="space-y-1"><Label htmlFor="node-label">Name</Label><Input id="node-label" value={selectedNode.data.label} onChange={(event) => updateSelected({ label: event.target.value })} /></div>
              <div className="space-y-1"><Label htmlFor="node-notes">Description</Label><Textarea id="node-notes" value={selectedNode.data.notes ?? ''} onChange={(event) => updateSelected({ notes: event.target.value })} rows={2} /></div>
              {selectedNode.type === 'data.transform' ? <div className="space-y-1"><Label htmlFor="transform-mapping">Output mapping (JSON)</Label><Textarea id="transform-mapping" rows={8} className="font-mono text-xs" value={mappingText || JSON.stringify(selectedNode.data.config.mapping ?? {}, null, 2)} onFocus={() => setMappingText(JSON.stringify(selectedNode.data.config.mapping ?? {}, null, 2))} onChange={(event) => setMappingText(event.target.value)} onBlur={() => { try { const mapping = JSON.parse(mappingText); updateSelected({ config: { ...selectedNode.data.config, mapping } }); setMappingText(JSON.stringify(mapping, null, 2)) } catch { setMappingText(JSON.stringify(selectedNode.data.config.mapping ?? {}, null, 2)) } }} /><p className="text-xs text-muted-foreground">Expressions: {'{{trigger.reference}}'}, {'{{nodes.<node-id>.output.value}}'}</p></div> : null}
              {selectedNode.type === 'logic.condition' ? <>
                <div className="space-y-1"><Label htmlFor="condition-path">Value path</Label><Input id="condition-path" value={String(selectedNode.data.config.path ?? '')} onChange={(event) => updateSelected({ config: { ...selectedNode.data.config, path: event.target.value } })} placeholder="trigger.approved" /></div>
                <div className="space-y-1"><Label htmlFor="condition-operator">Operator</Label><select id="condition-operator" className="h-9 w-full rounded-md border bg-background px-3 text-sm" value={String(selectedNode.data.config.operator ?? 'equals')} onChange={(event) => updateSelected({ config: { ...selectedNode.data.config, operator: event.target.value } })}>{['equals', 'notEquals', 'contains', 'greaterThan', 'isTruthy'].map((operator) => <option key={operator} value={operator}>{operator}</option>)}</select></div>
                <div className="space-y-1"><Label htmlFor="condition-value">Compare with (JSON)</Label><Input id="condition-value" value={JSON.stringify(selectedNode.data.config.value ?? true)} onChange={(event) => { try { const value = JSON.parse(event.target.value); updateSelected({ config: { ...selectedNode.data.config, value } }) } catch { /* Keep the last valid value. */ } }} /></div>
              </> : null}
              <div className="flex gap-2"><Button variant="outline" size="sm" onClick={duplicateSelected}><Copy className="mr-1 h-3.5 w-3.5" />Duplicate</Button><Button variant="destructive" size="sm" onClick={() => { recordHistory(); setNodes((current) => current.filter((node) => node.id !== selectedNode.id)); setEdges((current) => current.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id)); setSelectedId(null); setSaveState('unsaved') }}><Trash2 className="mr-1 h-3.5 w-3.5" />Delete</Button></div>
              {selectedStatus ? <div className="rounded-lg border p-3 text-sm"><div className="text-xs text-muted-foreground">Latest run status</div><div className="mt-1 font-medium">{selectedStatus}</div></div> : null}
            </> : <div className="space-y-3 text-sm"><p className="text-muted-foreground">Select a node to edit it. This workflow runs manually and completes within a bounded request.</p><div className="rounded-lg border p-3"><div className="font-medium">Run history</div>{runsQuery.data?.length ? <ul className="mt-2 space-y-2">{runsQuery.data.map((run) => <li key={run.id} className="flex items-center justify-between gap-2 text-xs"><span className="truncate font-mono">{run.id.slice(0, 10)}</span><span>{run.status}</span><span>{new Date(run.startedAt).toLocaleString()}</span></li>)}</ul> : <p className="mt-2 text-xs text-muted-foreground">No saved runs yet.</p>}</div><div className="rounded-lg border p-3"><Clock3 className="mb-2 h-4 w-4 text-muted-foreground" /><p className="text-xs text-muted-foreground">Execution stays on the server. This starter slice supports manual runs with trigger, transform, condition, and output nodes.</p></div></div>}
          </div>
        </Card>
      </div>
      <Card className="p-3"><div className="mb-2 flex items-center justify-between"><div className="text-sm font-semibold">Execution console</div>{runResult ? <span className={`rounded-full px-2 py-1 text-xs ${runResult.status === 'SUCCEEDED' ? 'bg-emerald-500/10 text-emerald-700' : 'bg-destructive/10 text-destructive'}`}>{runResult.status}</span> : <span className="text-xs text-muted-foreground">No execution selected</span>}</div>
        {executeMutation.error ? <p role="alert" className="mb-2 text-sm text-destructive">{executeMutation.error.message}</p> : null}
        {runResult ? <div className="grid gap-3 md:grid-cols-[1fr_1fr]"><div className="space-y-1">{runResult.steps?.map((step: any) => <button key={step.nodeId} onClick={() => setSelectedId(step.nodeId)} className="flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-xs"><span className="font-mono">{nodes.find((node) => node.id === step.nodeId)?.data.label ?? step.nodeId}</span><span>{step.status} · {step.attempts} attempt</span></button>)}{runResult.error ? <p className="rounded bg-destructive/10 p-2 text-xs text-destructive">{runResult.error}</p> : null}</div><pre className="max-h-40 overflow-auto rounded-lg bg-muted p-3 text-xs">{JSON.stringify({ output: runResult.output, steps: runResult.steps }, null, 2)}</pre></div> : <p className="text-xs text-muted-foreground">Run a saved workflow to inspect node inputs, outputs, status, and logs here.</p>}
      </Card>
      <div className="flex items-center justify-between text-xs text-muted-foreground"><span>{validateMutation.data ? 'Server validation is authoritative before save and run.' : 'Drafts are saved to the authenticated tenant workspace.'}</span>{workflowId ? <span className="font-mono">Workflow {workflowId}</span> : <span>New draft</span>}</div>
    </div>
  )
}

export function WorkflowStudio({ workflowId }: { workflowId?: string }) {
  return <ReactFlowProvider><WorkflowStudioInner workflowId={workflowId} /></ReactFlowProvider>
}

export function WorkflowStudioEntry() {
  const [workflowId, setWorkflowId] = React.useState<string | undefined>()
  React.useEffect(() => { setWorkflowId(new URLSearchParams(window.location.search).get('workflowId') ?? undefined) }, [])
  return <WorkflowStudio workflowId={workflowId} />
}
