// @ts-nocheck — see docs/app-walkthroughs-e2e-audit.md
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'
import { useSocket } from '@/providers/SocketProvider'

interface ActivityItem {
  id: string
  action: string
  description: string
  timestamp: Date
  status: 'completed' | 'in-progress' | 'pending'
}

const statusColors = {
  completed: 'bg-green-100 text-green-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  pending: 'bg-yellow-100 text-yellow-800',
}

function formatTime(date: Date): string {
  const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60))
  if (hours < 1) return 'Just now'
  if (hours === 1) return '1 hour ago'
  if (hours < 24) return `${hours} hours ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days > 1 ? 's' : ''} ago`
}

export function RecentActivity({ loading = false }: { loading?: boolean }) {
  const [items, setItems] = useState<ActivityItem[]>([])
  const { subscribe } = useSocket()

  useEffect(() => {
    const unsubCargo = subscribe('cargo:updated', (data) => {
      setItems((prev) => [
        { id: String(Date.now()), action: 'Cargo Updated', description: `Cargo ${data?.id ?? ''} status changed to ${data?.status ?? 'unknown'}`, timestamp: new Date(), status: 'in-progress' },
        ...prev.slice(0, 9),
      ])
    })
    const unsubShipment = subscribe('shipment:updated', (data) => {
      setItems((prev) => [
        { id: String(Date.now()), action: 'Shipment Update', description: `Shipment ${data?.trackingId ?? ''} — ${data?.status ?? ''}`, timestamp: new Date(), status: 'in-progress' },
        ...prev.slice(0, 9),
      ])
    })
    return () => { unsubCargo(); unsubShipment() }
  }, [subscribe])

  if (loading) {
    return (
      <Card className="border border-slate-200/70">
        <CardHeader className="rounded-t-xl bg-slate-50 px-6 py-4">
          <div className="h-5 w-32 animate-pulse rounded bg-slate-300" />
        </CardHeader>
        <CardContent className="px-6 py-4">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded bg-slate-200" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-slate-200/70">
      <CardHeader className="rounded-t-xl bg-slate-50 px-6 py-4">
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="px-6 py-4">
        {items.length === 0 ? (
          <p className="py-4 text-sm text-muted-foreground">No recent activity.</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col gap-2 border-b border-slate-100 pb-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-slate-950">{item.action}</p>
                    <Badge className={statusColors[item.status]} variant="secondary">
                      {item.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 break-words">{item.description}</p>
                  <p className="text-xs text-slate-500 mt-1">{formatTime(item.timestamp)}</p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 text-slate-400 shrink-0 sm:ml-4" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
