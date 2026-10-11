"use client"

import { AIProgressCard } from '@common/aiprogress-card'
import { AIAlert } from '@common/aialert'
import { AIStatusIndicator } from '@common/aistatus-indicator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package } from 'lucide-react'

const zones = [
  { id: 'A', label: 'Zone A — Dry Goods', used: 450, total: 530, status: 'healthy' as const },
  { id: 'B', label: 'Zone B — Refrigerated', used: 490, total: 530, status: 'warning' as const },
  { id: 'C', label: 'Zone C — Hazmat', used: 210, total: 530, status: 'healthy' as const },
  { id: 'D', label: 'Zone D — Overflow', used: 120, total: 530, status: 'healthy' as const },
]

const suggestions = [
  { sku: 'SKU-01003', from: 'Zone B', to: 'Zone D', reason: 'Zone B at 92% — move non-refrigerated items' },
  { sku: 'SKU-01007', from: 'Zone A', to: 'Zone C', reason: 'Hazmat reclassification required' },
]

export function InventorySlotSuggest() {
  return (
    <div className="space-y-6">
      <AIAlert
        type="warning"
        title="Zone B Near Capacity"
        message="Zone B is at 92% utilization. AI recommends pre-staging 2 SKUs to Zone D."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {zones.map((zone) => (
          <AIProgressCard
            key={zone.id}
            title={zone.label}
            currentProgress={zone.used}
            targetProgress={zone.total}
            icon={<Package className="h-5 w-5" />}
          />
        ))}
      </div>

      <Card className="border border-slate-200/70">
        <CardHeader className="px-6 py-4 bg-slate-50 rounded-t-xl">
          <CardTitle className="text-base flex items-center gap-2">
            AI Slot Suggestions
            <AIStatusIndicator status="twin-live" size="sm" label="Live" />
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 py-4 space-y-3">
          {suggestions.map((s, i) => (
            <div key={i} className="flex items-start justify-between border border-slate-100 rounded-lg p-3">
              <div>
                <p className="text-sm font-medium text-slate-900">{s.sku}</p>
                <p className="text-xs text-slate-500">{s.from} → {s.to}</p>
                <p className="text-xs text-slate-600 mt-1">{s.reason}</p>
              </div>
              <AIStatusIndicator status="pending" size="sm" label="Pending" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
