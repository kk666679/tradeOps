'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowUpRight, Plus, Search, Workflow } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { trpc } from '@/providers/TRPCProvider'

export function WorkflowDirectory() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const workflows = trpc.customAgents.orchestration.listWorkflows.useQuery({ q: query || undefined, take: 50 })
  return <div className="space-y-6">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><h1 className="text-2xl font-semibold tracking-tight">Workflow Studio</h1><p className="mt-1 text-sm text-muted-foreground">Build, validate, save, and run tenant workflows.</p></div>
      <Button onClick={() => router.push('/custom-agents/orchestration/canvas')}><Plus className="mr-2 h-4 w-4" />New workflow</Button>
    </div>
    <div className="relative max-w-sm"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search workflows" className="pl-9" aria-label="Search workflows" /></div>
    {workflows.error ? <div role="alert" className="rounded-lg border border-destructive/30 p-4 text-sm text-destructive">{workflows.error.message}</div> : null}
    {workflows.isLoading ? <p className="text-sm text-muted-foreground">Loading workflows…</p> : workflows.data?.length ? <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{workflows.data.map((workflow) => <Card key={workflow.id} className="p-4"><div className="flex items-start justify-between gap-3"><span className="rounded-lg bg-primary/10 p-2 text-primary"><Workflow className="h-4 w-4" /></span><Button asChild variant="ghost" size="icon" aria-label={`Open ${workflow.name}`}><Link href={`/custom-agents/orchestration/canvas?workflowId=${encodeURIComponent(workflow.id)}`}><ArrowUpRight className="h-4 w-4" /></Link></Button></div><h2 className="mt-3 font-semibold">{workflow.name}</h2><p className="mt-1 min-h-10 text-sm text-muted-foreground">{workflow.description || 'No description yet.'}</p><div className="mt-3 text-xs text-muted-foreground">Updated {new Date(workflow.updatedAt).toLocaleString()}</div></Card>)}</div> : <Card className="flex flex-col items-center px-6 py-14 text-center"><span className="rounded-xl bg-muted p-3"><Workflow className="h-6 w-6 text-muted-foreground" /></span><h2 className="mt-4 font-semibold">No workflows yet</h2><p className="mt-1 max-w-md text-sm text-muted-foreground">Start with a manual trigger, a data transform, a condition, and an output node.</p><Button className="mt-4" onClick={() => router.push('/custom-agents/orchestration/canvas')}><Plus className="mr-2 h-4 w-4" />Create workflow</Button></Card>}
  </div>
}
