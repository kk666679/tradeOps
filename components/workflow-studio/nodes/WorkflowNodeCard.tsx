'use client'

import * as React from 'react'
import { Handle, NodeResizer, Position, type NodeProps } from '@xyflow/react'
import { CircleCheck, GitBranch, Play, WandSparkles } from 'lucide-react'
import type { WorkflowNode } from '@/lib/workflow/types'

const icons = { 'trigger.manual': Play, 'data.transform': WandSparkles, 'logic.condition': GitBranch, 'flow.output': CircleCheck }

export function WorkflowNodeCard({ id, data, selected }: NodeProps<WorkflowNode>) {
  const nodeData = data as WorkflowNode['data']
  const type = (data as any).nodeType as WorkflowNode['type']
  const Icon = icons[type] ?? CircleCheck
  const branch = type === 'logic.condition'
  const trigger = type === 'trigger.manual'
  const output = type === 'flow.output'
  const accent = trigger ? 'border-emerald-500/60' : branch ? 'border-amber-500/60' : type === 'data.transform' ? 'border-violet-500/60' : 'border-primary/60'
  return (
    <div className={`relative min-w-52 rounded-xl border bg-card shadow-lg ${selected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''} ${accent}`}>
      <NodeResizer isVisible={selected} minWidth={190} minHeight={86} />
      {!trigger && <Handle type="target" position={Position.Left} id="in" className="!h-3 !w-3 !border-2 !border-background !bg-primary" aria-label="Input" />}
      <div className="flex items-start gap-3 p-3">
        <span className="mt-0.5 rounded-lg bg-muted p-2"><Icon className="h-4 w-4" aria-hidden="true" /></span>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{type?.split('.')[0]}</div>
          <div className="truncate text-sm font-semibold">{nodeData.label}</div>
          {nodeData.notes ? <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{nodeData.notes}</p> : null}
          {type === 'data.transform' && <p className="mt-1 text-[11px] text-muted-foreground">{Object.keys((nodeData.config?.mapping as object) ?? {}).length} mapped fields</p>}
          {branch && <p className="mt-1 text-[11px] text-muted-foreground">{String(nodeData.config?.operator ?? 'equals')}</p>}
        </div>
      </div>
      {branch ? <>
        <Handle type="source" position={Position.Bottom} id="true" style={{ left: '35%' }} className="!h-3 !w-3 !border-2 !border-background !bg-emerald-500" aria-label="True output" />
        <Handle type="source" position={Position.Bottom} id="false" style={{ left: '70%' }} className="!h-3 !w-3 !border-2 !border-background !bg-rose-500" aria-label="False output" />
        <div className="flex justify-around border-t px-2 py-1 text-[10px]"><span className="text-emerald-600">True</span><span className="text-rose-600">False</span></div>
      </> : !output && <Handle type="source" position={Position.Right} id="out" className="!h-3 !w-3 !border-2 !border-background !bg-primary" aria-label="Output" />}
    </div>
  )
}
