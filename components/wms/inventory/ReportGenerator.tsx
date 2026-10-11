"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AIStatusIndicator } from '@common/aistatus-indicator'
import { AIAlert } from '@common/aialert'
import { Download, FileText, Loader2 } from 'lucide-react'

const reportTypes = [
  { id: 'inventory', label: 'Inventory Summary', description: 'Stock levels, reorder points, ABC analysis' },
  { id: 'throughput', label: 'Throughput Report', description: 'Units processed, cycle times, zone performance' },
  { id: 'forecast', label: 'Demand Forecast', description: 'AI-generated demand predictions and confidence' },
  { id: 'compliance', label: 'Compliance Audit', description: 'Hazmat, ISO, OSHA status across all zones' },
]

export function ReportGenerator() {
  const [selected, setSelected] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [done, setDone] = useState(false)

  const generate = async () => {
    if (!selected) return
    setGenerating(true)
    setDone(false)
    // Simulate report generation — wire to /api/ai/insights in production
    await new Promise((r) => setTimeout(r, 1800))
    setGenerating(false)
    setDone(true)
  }

  return (
    <Card className="border border-slate-200/70">
      <CardHeader className="px-6 py-4 bg-slate-50 rounded-t-xl flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Report Generator
        </CardTitle>
        <AIStatusIndicator status={generating ? 'syncing' : done ? 'success' : 'idle'} size="sm" />
      </CardHeader>
      <CardContent className="px-6 py-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {reportTypes.map((r) => (
            <button
              key={r.id}
              onClick={() => { setSelected(r.id); setDone(false) }}
              className={`text-left p-3 rounded-lg border transition-all ${
                selected === r.id
                  ? 'border-indigo-400 bg-indigo-50'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <p className="text-sm font-medium text-slate-900">{r.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{r.description}</p>
            </button>
          ))}
        </div>

        {done && (
          <AIAlert
            type="success"
            title="Report ready"
            message={`${reportTypes.find(r => r.id === selected)?.label} has been generated.`}
            action={{ label: 'Download PDF', onClick: () => {} }}
          />
        )}

        <Button
          onClick={generate}
          disabled={!selected || generating}
          className="w-full"
          size="sm"
        >
          {generating ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generating…</>
          ) : (
            <><Download className="h-4 w-4 mr-2" />Generate Report</>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
